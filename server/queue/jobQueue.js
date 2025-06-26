const { Queue } = require("bullmq");
const connection = require("../config/redisClient");

const jobQueue = new Queue("job-import", { connection });

module.exports = jobQueue;
