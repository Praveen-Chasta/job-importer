require("dotenv").config();
const cron = require("node-cron");
const jobQueue = require("../queue/jobQueue");

const urls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

function scheduleJobs() {
  cron.schedule("0 * * * *", async () => {
    for (const url of urls) {
      await jobQueue.add("import-job", { url });
    }
    console.log("[Cron] Added job import tasks to queue");
  });
}

// ✅ Cron scheduling every 1 Hour (for testing)
scheduleJobs();

// ✅ Manual run for testing
(async function triggerManually() {
  for (const url of urls) {
    await jobQueue.add("import-job", { url });
  }
  console.log("[Manual] Triggered import jobs manually for testing");
})();

module.exports = scheduleJobs;
