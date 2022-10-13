const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const { calcPercentChange } = require("../helper/helper");
const prisma = new PrismaClient();

app.get("/set=:setName", async (req, res) => {
  const { setName } = req.params;

  try {
    const results =
      await prisma.$queryRaw`select set_name, set_value, card_count, url, ultra_rare_total, secret_rare_total, other_cards_total, time_stamp from 
    (select round(sum(price), 2) as "full_set_total", time_stamp as f_time_stamp
    from card_data_table 
    where set_name = ${setName} 
    group by time_stamp) as f
    left join
    (select * 
    from set_data_table 
    where set_name = ${setName})
    as t
    on f.f_time_stamp = t.time_stamp
    left join
    (select round(sum(price), 2) as "ultra_rare_total", time_stamp as u_time_stamp
    from card_data_table 
    where set_name = ${setName} 
    and rarity = "Ultra Rare" 
    group by time_stamp) as u
    on f.f_time_stamp = u.u_time_stamp
    left join 
    (select round(sum(price), 2) as "secret_rare_total", time_stamp as s_time_stamp
    from card_data_table 
    where set_name = ${setName} 
    and rarity = "Secret Rare" 
    group by time_stamp) as s
    on f.f_time_stamp = s.s_time_stamp
    left join
    (select round(sum(price), 2) as "other_cards_total", time_stamp as o_time_stamp
    from card_data_table 
    where set_name = ${setName} 
    and (rarity = "Common" or rarity = "Uncommon" or rarity = "Rare" or rarity = "Holo Rare")
    group by time_stamp) as o
    on f.f_time_stamp = o_time_stamp`;
    res.status(200).json(results);
  } catch (e) {
    res.status(400).send({ msg: e });
  }
});

app.get("/today", async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
        select * 
        from (select * from set_data_table 
        where time_stamp = curdate()) 
        as today
        left join
        (select set_value as prev_value, set_name as set_name_column
        from set_data_table 
        where time_stamp = (DATE_SUB(CURDATE(), INTERVAL 14 DAY))) as yesterday
        on today.set_name = coalesce(yesterday.set_name_column, today.set_name)
        order by today.set_name
    `;
    res.status(200).json(
      results.map((set) => ({
        ...set,
        price_change: (set.prev_value - set.set_value).toFixed(2),
        percent_change: calcPercentChange(set.set_value, set.prev_value),
      }))
    );
  } catch (e) {
    console.log(e);
    res.status(400).send({ errorMsg: e });
  }
});

// @GET
// /api/sets/daterange/set=:set

app.get(`/daterange/set=:set`, async (req, res) => {
  const { set } = req.params;
  try {
    const results = await prisma.$queryRaw`
      select distinct time_stamp as 'date', set_value 
      from set_data_table 
      where set_name = ${set} and time_stamp > "2022-03-22" 
      order by date asc`;
    res.status(200).json(results);
  } catch (e) {
    res.status(400).send({ msg: e });
  }
});

app.get("/list", async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
        select distinct(set_name) 
        from set_data_table 
        order by set_name asc`;
    res.status(200).json(results);
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

module.exports = app;
