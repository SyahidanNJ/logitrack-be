"use strict";

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const moment = require("moment");
const response = require("./src/tools/response");
// const { startStockAlertScheduler } = require("./src/tools/stockAlertScheduler");

const app = express();

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser(process.env.JWT_SECRET || "logitrack-secret-key-change-in-prod", { httpOnly: true }));

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:4201",
  "http://localhost",
];
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// ── Disable HTTP Caching for all API routes ──────────────────────────────────
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ── Timestamp middleware ───────────────────────────────────────────────────
app.use((req, res, next) => {
  req.customDate = moment().format("DD MMM YYYY HH:mm:ss");
  req.customTime = moment().format("HH:mm:ss");
  req.customTimestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  req.startTime = new Date().getTime();
  next();
});

// ── Static uploads ─────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Auto-register routes ───────────────────────────────────────────────────
const routesDir = path.join(__dirname, "./src/routes");
if (fs.existsSync(routesDir)) {
  fs.readdirSync(routesDir).forEach((file) => {
    if (file.endsWith(".js")) {
      const routePath = path.join(routesDir, file);
      const routeName = path.parse(routePath).name;
      const dashedRoute = routeName.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
      app.use(`/api/${dashedRoute}`, require(routePath));
      console.log(`[ROUTE] /api/${dashedRoute}`);
    }
  });
}

// ── Health check ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  response(res, req, "success", { service: "logitrack-backend", status: "ok" }, 200, false);
});

// ── 404 fallback ───────────────────────────────────────────────────────────
app.use((req, res) => {
  response(res, req, "notFound", null, 404, true);
});

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3003;
app.listen(PORT, async () => {
  console.log(`\n[LogiTrack Backend] Running on http://localhost:${PORT}`);
  console.log(`[SERVICE] ${process.env.SERVICE_NAME || "logitrack"}`);
  console.log(`[ENV]     ${process.env.NODE_ENV || "development"}\n`);

  // Start background scheduler for stock alerts
  // startStockAlertScheduler();
});

module.exports = app;
