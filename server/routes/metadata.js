const express = require("express");
const app = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all sets

app.get("/sets/all", async (req, res) => {
  try {
    const results = await prisma.set_metadata.findMany();
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

// Get set metadata by TCGPlayer set name

app.get("/sets/setName/:setName", async (req, res) => {
  const { setName } = req.params;
  try {
    const setMetadata = await prisma.set_metadata.findFirst({
      where: { set_name: setName },
    });
    const cardMetadata = await prisma.card_metadata.findMany({
      where: { set_id: setMetadata.id },
    });
    const results = { ...setMetadata, cardMetadata };
    if (!results) {
      res.status();
    }
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

// Get set info by set ID

app.get("/sets/id/:setId", async (req, res) => {
  const { setId } = parseInt(req.params.setId);
  try {
    const setMetadata = await prisma.set_metadata.findFirst({
      where: { id: setId },
    });
    const cardMetadata = await prisma.card_metadata.findMany({
      where: { set_id: setId },
    });
    const results = { ...setMetadata, cardMetadata };
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

// Update set metadata by ID, from web UI

app.post("/update/sets/id/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  try {
    const results = await prisma.set_metadata.update({
      where: { id: id },
      data: data,
    });
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

// get card by product ID

app.get("/cards/productId/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);
  try {
    const results = await prisma.card_metadata.findFirst({
      where: { product_id: productId },
      include: { set_metadata: true },
    });
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

// get card by card ID

app.get("/cards/id/:cardId", async (req, res) => {
  const { cardId } = req.params;
  try {
    const results = await prisma.card_metadata.findFirst({
      where: { card_id: parseInt(cardId) },
      include: { set_metadata: true },
    });
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    res.status(400).send({ msg: e });
  }
});

module.exports = app;
