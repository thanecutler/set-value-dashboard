const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const { calcPercentChange } = require("../helper/helper");
const prisma = new PrismaClient();

app.get(`/api/card/set=:setName/card=:cardName`, async (req, res) => {
  const { setName, cardName } = req.params;
  try {
    const results = await prisma.card_data_table.findMany({
      where: { card_name: cardName, set_name: setName, deleted: 0 },
    });
  } catch (e) {
    res.status(400).send({ msg: e });
  }
  res.json(results);
});

module.exports = app;
