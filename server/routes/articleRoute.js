const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.post("/", async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
});

router.get("/", async (req, res) => {
  const data = await Article.find();
  res.json(data);
});

module.exports = router;