# 🧱 System Architecture – Job Importer

This document explains the architectural design of the **Job Importer** system, how components interact, and the design decisions made.

---

## 📌 Objective

Build a scalable system that imports job listings from external RSS feeds, processes them asynchronously using a queue system, stores them in a database, and shows the import logs in a regularly refreshed (or real-time)  frontend dashboard.

---

## 🧩 Architecture Overview

+-------------+ +-------------+ +-------------+
| RSS Feeds | ---> | Express.js | ---> | BullMQ |
| (job URLs) | | Backend | | Queue |
+-------------+ +-------------+ +-------------+
|
v
+----------------+
| Job Worker |
| (Node.js) |
+----------------+
|
v
+-----------------+
| MongoDB (Jobs + |
| Import Logs) |
+-----------------+
|
v
+-------------------------+
| Next.js Frontend (Logs) |
+-------------------------+


---

## 🧰 Components

### 1. **RSS Feed URLs**
- These are external XML job feeds (e.g., `jobicy.com`, `higheredjobs.com`).
- Fetched periodically using `node-cron`.

---

### 2. **Express Backend (`/server`)**
- Provides API endpoints (e.g., `/api/logs`) for frontend to fetch data.
- Schedules jobs using `node-cron`.
- Pushes feed processing tasks to Redis using `BullMQ`.

---

### 3. **BullMQ + Redis**
- Redis serves as an in-memory job queue store.
- BullMQ queues job-import tasks which are picked up by workers.
- Decouples the fetching/saving logic from the API server.

---

### 4. **Worker (`jobWorker.js`)**
- Pulls jobs from Redis queue.
- Parses the RSS feed (`xml2js`).
- Saves new jobs to MongoDB.
- Logs the results in the `ImportLog` collection:
  - Total fetched
  - New records
  - Updated records
  - Failed records + reasons

---

### 5. **MongoDB**
- Stores:
  - `Job` collection → actual job data
  - `ImportLog` collection → job import summaries

---

### 6. **Next.js Frontend (`/client`)**
- Displays import logs in a styled table with:
  - Pagination
  - Color-coded stats
  - Accordion for failed job reasons
  - Clickable links to original job feed URLs

---

## 🧠 Design Decisions

| Area         | Decision                                                                 |
|--------------|--------------------------------------------------------------------------|
| Job Queue    | Used BullMQ for robust and scalable job handling                         |
| Parsing      | Used `xml2js` for flexible RSS feed parsing                              |
| Cron         | Used `node-cron` to schedule imports every 10 seconds (configurable)     |
| Frontend     | Built in Next.js for server-side rendering + smooth pagination           |
| Realtime     | Initially designed with `socket.io`, later switched to REST polling      |
| Separation   | Cleanly separates worker logic from the Express app                      |
| Logs         | Saved with detailed counts and timestamps for traceability               |

---

## 🔧 How to Extend This

- Add error handling to notify on failed feeds
- Support JSON-based APIs (besides RSS)
- Add authentication for the frontend dashboard
- Add a retry mechanism for failed jobs
- Add dashboard stats summary (e.g., charts)

---

## ✅ Summary

This architecture ensures that:
- The system is **decoupled**, **asynchronous**, and **scalable**
- Frontend remains lightweight and real-time (or refreshable)
- Failed job records are traceable and visible
- Feeds can be added or modified easily

