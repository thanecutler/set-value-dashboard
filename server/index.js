const express = require("express");
const app = express();
const port = 5000;
const config = require("./config");
const mysql = require("mysql2");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const db = mysql.createPool(config.db);

app.listen(port, () => {
  console.log(`server running at localhost:${port}`);
});

app.get("/", (req, res) => {
  res.status(200);
});

app.get(`/api/sets/today`, (req, res) => {
  db.query(
    `select * 
    from (select * from set_data_table 
    where DATE(time_stamp) = curdate()) 
    as today
    left join
    (select set_value as prev_value, set_name
    from set_data_table 
    where DATE(time_stamp) = curdate() - 7) as yesterday
    on today.set_name = yesterday.set_name
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

app.get(`/api/cards/set=:set/date=:date`, (req, res) => {
  const { set, date } = req.params;
  const query = `select * from card_data_table where set_name = ? and date(time_stamp) = ? order by card_name`;

  db.query(query, [set, date], (e, results) => {
    if (e) {
      throw e;
    }
    res.json(results);
  });
});

app.get(`/api/cards/top/today`, (req, res) => {
  db.query(
    `select * from card_data_table where date(time_stamp) = curdate() - 1 order by price desc limit 10;`,
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
    `select * from card_data_table where card_name like ? and date(time_stamp) = curdate() order by card_name;`,
    `%${searchTerm}%`,
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

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
