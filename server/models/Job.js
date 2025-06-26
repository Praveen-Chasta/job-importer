const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  company: String,
  location: String,
  type: String,
  description: String,
  link: String,
  datePosted: Date,
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);