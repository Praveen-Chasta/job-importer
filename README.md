# 🧰 Job Importer System

A full-stack application to import job listings from multiple RSS feeds using a background queue (BullMQ + Redis), store them in MongoDB, and display the import history with detailed logs in a responsive Next.js dashboard.

---

## 📁 Project Structure

/client → Frontend (Next.js + Tailwind)
/server → Backend (Express.js, MongoDB, BullMQ)
/docs → Architecture and technical design



---

## 🚀 Features

- ✅ Import jobs from multiple RSS feeds automatically
- ✅ Queue-based background job processing with `BullMQ` + `Redis`
- ✅ Store job records and import logs in MongoDB
- ✅ Next.js frontend to view logs in a styled table with:
  - Pagination
  - Color-coded job stats
  - Clickable feed links
  - Accordion for viewing failed job reasons

---

## ⚙️ Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| Frontend     | Next.js, TypeScript, Tailwind CSS |
| Backend      | Node.js, Express.js, BullMQ |
| Database     | MongoDB (via Mongoose) |
| Queue        | Redis |
| Parsing      | xml2js |
| Scheduling   | node-cron |

## 📦 Dependencies

### 🔧 Backend (`/server`)

| Package         | Description                                  |
|-----------------|----------------------------------------------|
| express         | Web server framework                         |
| mongoose        | MongoDB ODM                                  |
| cors            | Enable cross-origin requests                 |
| dotenv          | Environment variables                        |
| axios           | HTTP client for job feeds                    |
| xml2js          | XML to JSON parser                           |
| bullmq          | Redis-based job queue                        |
| ioredis         | Redis client for BullMQ                      |
| node-cron       | Job scheduler for periodic tasks             |
| nodemon (dev)   | Auto-reloading dev server                    |

### 🎨 Frontend (`/client`)

| Package        | Description                                  |
|----------------|----------------------------------------------|
| next           | React framework for SSR                      |
| react          | React library                                |
| react-dom      | DOM renderer for React                       |
| axios          | HTTP client for API calls                    |
| tailwindcss    | Utility-first CSS framework                  |
| typescript     | Strong typing in JS                          |
| postcss        | Used with Tailwind                           |
| autoprefixer   | Adds vendor prefixes                         |

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
gitclone https://github.com/Praveen-Chasta/job-importer.git
cd job-importer


# Backend setup
cd server
npm install

# Frontend setup
cd client
npm install

```
### 2. Setup Environment Variables

```bash
# MongoDb Setup
MONGO_DB_URL= "your-url"
REDIS_URL= "your-url"
```

### 3. Start Redis and MongoDB

```powershell
# Redis Setup (If Its Installed)
redis-server --daemonize yes
redis-cli ping


```