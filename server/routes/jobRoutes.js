const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ pubDate: -1 });
  res.json(jobs);
});
module.exports = router;