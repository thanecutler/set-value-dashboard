const express = require("express");
const app = express.Router();

app.get(`/api/sets/today`, (req, res) => {
  console.log("req received!");
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

app.get(`/sets/set=:set`, (req, res) => {
  const { set } = req.params;
  console.log("req received!");

  db.query(
    `SELECT * FROM set_data_table WHERE set_name = ?;`,
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

module.exports = app;
