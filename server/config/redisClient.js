const Redis = require("ioredis");

if (!process.env.REDIS_URL) {
  throw new Error("❌ REDIS_URL is not defined in your .env file");
}

const useTLS = process.env.REDIS_URL.includes("upstash");

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: useTLS ? {} : undefined,
});

connection.on("connect", () => {
  console.log("✅ Redis connected");
});

connection.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

module.exports = connection;
