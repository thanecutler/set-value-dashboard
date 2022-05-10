const express = require("express");
const app = express();
const port = 5000;
const config = require("./config");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const saltRounds = config.saltRounds;

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    key: "username",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 1000 * 60 * 60 * 24 },
  })
);

const db = mysql.createPool(config.db);

app.listen(port, () => {
  console.log(`server running at localhost:${port}`);
});

app.post(`/api/register`, (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({ msg: "error: missing parameters" });
  }
  db.query(
    `select * from users where username = ?`,
    [username],
    (e, results) => {
      if (results.length > 0) {
        res.status(400).json({ msg: "error: username already exists" });
        return;
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(err);
          }
          db.query(
            `insert into users (username, password, email) values (?, ?, ?)`,
            [username, hash, email],
            (e, results) => {
              if (e) {
                console.log(e);
              }
              res.status(200).json({ msg: "good" });
            }
          );
        });
      }
    }
  );
});

app.post(`/api/login`, (req, res) => {
  const { username, password } = req.body;
  db.query(
    `select * from users where username = ?`,
    [username],
    (e, results) => {
      if (e) {
        console.log(e);
      }
      if (!results.length) {
        res.send({ msg: "Username not found" });
      }
      if (results.length) {
        bcrypt.compare(password, results[0].password, (e, response) => {
          if (response) {
            req.session.user = results[0].username;
            console.log(req.session.user);
            res.send(results);
          } else {
            res.send({ msg: "Incorrect password" });
          }
        });
      }
    }
  );
});

app.get(`/api/login`, (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, username: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get(`/api/databasestats`, (req, res) => {
  db.query(
    `select 
  (select count(*) from card_data_table
  ) as card_row_count,
  (select count(*) from set_data_table
  ) as set_row_count,
  (select max(time_stamp) from card_data_table
  ) as time_completed`,
    (e, results) => {
      res.json(results);
    }
  );
});

app.get(`/api/sets/today`, (req, res) => {
  console.log(req.headers);
  db.query(
    `select * 
    from (select * from set_data_table 
    where DATE(time_stamp) = curdate()) 
    as today
    left join
    (select set_value as prev_value, set_name
    from set_data_table 
    where DATE(time_stamp) = (DATE_SUB(CURDATE(), INTERVAL 14 DAY))) as yesterday
    on today.set_name = coalesce(yesterday.set_name, today.set_name)
    order by today.set_name
    `,
    (e, results) => {
      res.json(results);
    }
  );
});

app.get(`/api/sets/set=:set`, (req, res) => {
  const { set } = req.params;

  db.query(
    `SELECT * FROM set_data_table WHERE set_name = ? order by time_stamp asc;`,
    set,
    (e, results) => {
      if (e) {
        res.send(e);
        throw e;
      }
      res.json(results);
    }
  );
});

app.get(`/api/sets/set=:set/orderby=:orderby/dir=:direction`, (req, res) => {
  const { set, orderby, direction } = req.params;
  db.query(
    `SELECT * FROM set_data_table WHERE set_name = ? ORDER BY time_stamp asc`,
    [set, orderby, direction],
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

app.get(`/api/sets/dates/set=:set`, (req, res) => {
  const { set } = req.params;
  db.query(
    `select distinct(date(time_stamp)) as 'date', set_value from set_data_table where set_name = ? order by date desc`,
    [set],
    (e, results) => {
      res.json(results);
    }
  );
});

app.get(`/api/sets/list`, (req, res) => {
  db.query(
    `select distinct(set_name) from set_data_table order by set_name asc`,
    (e, results) => {
      res.json(results);
    }
  );
});

app.get(`/api/card/set=:setName/card=:cardName`, (req, res) => {
  const { setName, cardName } = req.params;
  db.query(
    `select * from card_data_table where card_name = ? and set_name = ?`,
    [cardName, setName],
    (e, results) => {
      res.json(results);
    }
  );
});

app.get(`/api/cards/set=:set/date=:date`, (req, res) => {
  const { set, date } = req.params;
  const query = `select * 
  from (select card_name, set_name, price, time_stamp, rarity, card_number, url from card_data_table 
  where DATE(time_stamp) = ? and set_name = ?) 
  as today
  order by today.card_name`;
  // left join
  // (select price as prev_value, card_name, set_name
  // from card_data_table
  // where DATE(time_stamp) = (DATE_SUB(?, INTERVAL 7 DAY)) and set_name = ?) as yesterday
  // on today.card_name = yesterday.card_name

  db.query(query, [date, set, date, set], (e, results) => {
    if (e) {
      throw e;
    }
    res.json(results);
  });
});

app.get(`/api/cards/set=:set/today`, (req, res) => {
  const { set } = req.params;
  const query = `select * 
  from (select id, card_name, price, time_stamp, rarity, card_number, url from card_data_table 
  where DATE(time_stamp) = curdate() and set_name = ?) 
  as today
  left join
  (select price as prev_value, card_name, set_name
  from card_data_table 
  where DATE(time_stamp) = (DATE_SUB(curdate(), INTERVAL 7 DAY)) and set_name = ?) as yesterday
  on today.card_name = yesterday.card_name
  order by today.card_name`;

  db.query(query, [set, set], (e, results) => {
    if (e) {
      throw e;
    }
    res.json(results);
  });
});
app.get(`/api/cards/set=:set/today/price`, (req, res) => {
  const { set } = req.params;
  const query = `select * 
  from (select id, card_name, price, time_stamp, rarity, card_number, url from card_data_table 
  where DATE(time_stamp) = curdate() and set_name = ?) 
  as today
  left join
  (select price as prev_value, card_name, set_name
  from card_data_table 
  where DATE(time_stamp) = (DATE_SUB(curdate(), INTERVAL 7 DAY)) and set_name = ?) as yesterday
  on today.card_name = yesterday.card_name
  order by today.price desc`;

  db.query(query, [set, set], (e, results) => {
    if (e) {
      throw e;
    }
    res.json(results);
  });
});

app.get(`/api/cards/top/today`, (req, res) => {
  db.query(
    `select * from card_data_table where date(time_stamp) = curdate() order by price desc limit 10;`,
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

app.get(`/api/cards/search/name=:searchTerm`, (req, res) => {
  const { searchTerm } = req.params;

  db.query(
    `select * from card_data_table 
    where date(time_stamp) = curdate() 
    and card_name like ? or date(time_stamp) = curdate() 
    and card_name like ? or date(time_stamp) = curdate() 
    and card_name like ? 
    order by card_name;`,
    [`${searchTerm} %`, `${searchTerm}`, `% ${searchTerm} %`],
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

// check

app.post(`/api/check`, (req, res) => {
  const { card_name, set_name } = req.body;
  const sql = `insert into checklist (card_name, set_name) values (?, ?)`;
  const values = [card_name, set_name];

  db.query(sql, values, (e, results) => {
    if (e) {
      throw e;
    }
  });
  db.query(
    `select A.*, 
    CASE WHEN B.card_name IS NOT NULL
    THEN true
    ELSE false
    END
    as 'is_owned'
    from card_data_table A
    left join checklist B
    on A.card_name = B.card_name
    and A.set_name = B.set_name
    where A.set_name = ?
    and date(A.time_stamp) = curdate()`,
    set_name,
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

// psa

app.post("/api/psa/add", (req, res) => {
  const { card_name, set_name, card_number, card_grade } = req.body;
  const sql =
    "INSERT INTO psa_cards (card_name, set_name, card_number, card_grade) VALUES (?, ?, ?, ?);";
  const vals = [card_name, set_name, card_number, card_grade];
  db.query(sql, vals, (e, results) => {
    if (e) {
      throw e;
    }
  });
  db.query("SELECT * FROM psa_cards", (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});

app.get("/api/psa/all", (req, res) => {
  db.query("SELECT * FROM psa_cards", (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});

app.delete("/api/psa/remove", (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM psa_cards WHERE id = ?";
  db.query(sql, [id], (e, results) => {
    if (e) {
      throw e;
    }
    res.send(results);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}
