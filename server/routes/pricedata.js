const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { DateTime } = require("luxon");

app.get("/sets/set/id/:id/today", async (req, res) => {
  const id = parseInt(req.params.id);
  const desiredDateTime = DateTime.local().startOf("day");

  console.log(desiredDateTime.toJSDate());

  try {
    const results = await prisma.set_data_table.findMany({
      where: {
        set_id: id,
        // time_stamp: {
        //   equals: desiredDateTime.toJSDate(),
        // },
      },
    });
    res.status(200).send(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

app.get("/sets/all", async (req, res) => {
  try {
    const results = await prisma.$queryRaw`
        select round(sum(price), 2) as set_value, set_id, sm.*
        from card_data_table cdt
        left join set_metadata sm
        on sm.id = cdt.set_id
        where time_stamp = '2023-5-28'
        group by set_id;`;
    res.status(200).send(results);
  } catch (error) {
    res.status(400).send({ msg: error });
    throw new Error(`Error retrieving card data: ${error}`);
  }
});

app.post("/create", async (req, res) => {
  // check set metadata to see if set with that name exists
  // if true get metadata
  // if false create new set record
});

app.get("/cards/card/productId/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const cardMetadata = await prisma.card_metadata.findFirst({
      where: { product_id: productId },
    });

    const priceHistory = await prisma.card_data_table.findMany({
      select: { time_stamp: true, price: true },
      where: { card_id: cardMetadata.card_id },
      orderBy: { time_stamp: "asc" },
    });

    res.status(200).send({ ...cardMetadata, priceHistory });
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: "Product ID not found" });
  }
});

module.exports = app;
