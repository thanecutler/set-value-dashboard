const express = require("express");
const app = express();
const port = 5000;
const config = require("./config");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const saltRounds = config.saltRounds;
const helper = require("./helper/helper");

const sets = require("./routes/sets");

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const logRequest = (req, res, next) => {
  console.log(req.url);
  next();
};

app.use(logRequest);

app.use("/api/sets", sets);
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

app.get(`/api/databasestats`, (req, res) => {
  // this should be a service
  // log database stats every night after scan
  db.query(
    `select 
  (select max(id) from card_data_table
  ) as card_row_count,
  (select count(*) from set_data_table
  ) as set_row_count,
  (select max(time_stamp) from card_data_table
  ) as time_completed,
  (select count(distinct date(time_stamp)) from set_data_table)
  as day_count,
  (select round(sum(data_length + index_length) / 1024 / 1024, 1) 
  from information_schema.tables
  where table_schema = "set_data_schema") as size`,
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
  where time_stamp = ? and set_name = ?) 
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
  from (select id, card_name, set_name, price, time_stamp, rarity, card_number, url from card_data_table 
  where time_stamp = curdate() and set_name = ?) 
  as today
  left join
  (select price as prev_value, card_name as card_name_column
  from card_data_table 
  where time_stamp = (DATE_SUB(curdate(), INTERVAL 7 DAY)) and set_name = ?) as yesterday
  on today.card_name = coalesce(yesterday.card_name_column, today.card_name)
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
  from (select id, card_name, set_name, price, time_stamp, rarity, card_number, url from card_data_table 
  where DATE(time_stamp) = curdate() and set_name = ?) 
  as today
  left join
  (select price as prev_value, card_name as card_name_column
  from card_data_table 
  where DATE(time_stamp) = (DATE_SUB(curdate(), INTERVAL 7 DAY)) and set_name = ?) as yesterday
  on today.card_name = coalesce(yesterday.card_name_column, today.card_name)
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
    `select * 
    from (select id, card_name, set_name, price, time_stamp, rarity, card_number, url from card_data_table 
    where time_stamp = curdate() and card_name like ?) 
    as today
    left join
    (select price as prev_value, card_name as prev_card_name, set_name as prev_set_name
    from card_data_table 
    where time_stamp = (DATE_SUB(curdate(), INTERVAL 7 DAY)) and card_name like ?) as yesterday
    on today.card_name = coalesce(yesterday.prev_card_name, today.card_name)
    and 
    today.set_name = yesterday.prev_set_name
    order by today.price desc`,
    [`%${searchTerm}%`, `%${searchTerm}%`],
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(
        results.map((card) => ({
          ...card,
          price_change: parseInt((card.price - card.prev_value).toFixed(2)),
          percent_change: helper.calcPercentChange(card.price, card.prev_value),
        }))
      );
    }
  );
});

app.get("/api/cards/search/timeseries/name=:searchTerm", (req, res) => {
  const { searchTerm } = req.params;
  db.query(
    `select 
    date(time_stamp) as date, round(sum(price), 2) as total, count(card_name) as card_count
    from card_data_table 
    where card_name like ? 
    group by date`,
    [`%${searchTerm}%`],
    (e, results) => {
      if (e) {
        throw e;
      }
      res.json(results);
    }
  );
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}
