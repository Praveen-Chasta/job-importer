require("dotenv").config();
const { Worker } = require("bullmq");
const axios = require("axios");
const xml2js = require("xml2js");
const Job = require("../models/Job");
const ImportLog = require("../models/ImportLog");
const connectDB = require("../config/db");
const connection = require("../config/redisClient"); 

const parser = new xml2js.Parser({ explicitArray: false });

async function startWorker() {
  await connectDB(); 
  console.log("👷 Worker started and waiting for jobs...");

  new Worker(
    "job-import",
    async (job) => {
      const url = job.data.url;
      console.log(`🔍 Processing job for URL: ${url}`);

      let newJobs = 0;
      let updatedJobs = 0;
      const failed = [];
      const newJobIds = new Set();
      let items = [];
      let timestamp = new Date();

      try {
        const response = await axios.get(url);
        const parsed = await parser.parseStringPromise(response.data);

        items = parsed.rss?.channel?.item || [];
        timestamp = new Date(parsed.rss?.channel?.lastBuildDate || new Date());

        for (const item of items) {
          const jobData = {
            jobId: item.guid?._ || item.link,
            company: item.title,
            description: item.description,
            link: item.link,
            pubDate: new Date(item.pubDate),
          };

          try {
            const result = await Job.updateOne(
              { jobId: jobData.jobId },
              { $setOnInsert: jobData },
              { upsert: true }
            );

            if (result.upsertedCount > 0) {
              newJobIds.add(jobData.jobId);
            } else {
              if (newJobIds.has(jobData.jobId)) {
                newJobIds.delete(jobData.jobId);
                updatedJobs++;
              } else {
                updatedJobs++;
              }
            }
          } catch (err) {
            failed.push({ reason: err.message, job: jobData });
          }
        }

        newJobs = newJobIds.size;
      } catch (err) {
        failed.push({ reason: `Parsing failed: ${err.message}`, job: { url } });
      }

      const formattedTimestamp = timestamp
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");

      await ImportLog.create({
        fileName: url,
        timestamp,
        totalFetched: items.length,
        newJobs,
        updatedJobs,
        failedJobs: failed,
      });

      const companyName = items[0]?.title || "Unknown";

      console.log(
        `\n📦 Company: ${companyName}\n🕒 Import Date & Time: ${formattedTimestamp}\n✅ Total: ${items.length} | 🆕 New: ${newJobs} | 🔄 Updated: ${updatedJobs} | ❌ Failed: ${failed.length}`
      );

      if (failed.length > 0) {
        const uniqueReasons = [...new Set(failed.map((f) => f.reason))];
        console.log(`\n❌ Failed Jobs: ${failed.length}`);
        console.log("🚨 Reasons:");
        uniqueReasons.forEach((r, i) => console.log(`${i + 1}. ${r}`));
      }
    },
    { connection } 
  );
}

startWorker();
