require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");
const logRoutes = require("./routes/logRoutes");
const scheduleJobs = require("./cron/scheduleJobs");
const connectDB = require("./config/db");

const app = express();
const PORT = 5000;

// ✅ CORS Policy
const corsOptions = {
  origin: ["http://localhost:3000", "https://job-importer-phi.vercel.app" ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

async function startServer() {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.use("/api/jobs", jobRoutes);
    app.use("/api/logs", logRoutes);

    scheduleJobs();

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();
