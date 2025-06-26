const mongoose = require("mongoose");

const importLogSchema = new mongoose.Schema({
  fileName: String,
  timestamp: Date,
  totalFetched: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [{ reason: String, job: Object }]
});
module.exports = mongoose.model("ImportLog", importLogSchema);