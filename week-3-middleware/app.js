import express from "express";
import dogsRouter from "./routes/dogs.js";
import esMain from "es-main";

const app = express();

// Assignment 3b and 3c ask you to add middleware in this file.

import { randomUUID } from "crypto";

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

app.post("/{*splat}", (req, res, next) => {
  if (req.get("Content-Type") != "application/json") {
    return res.status(400).json({
      error: "Content-Type must be application/json",
      requestId: req.requestId,
    });
  }
  next();
});

app.use(express.json({ limit: "1mb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use((req, res, next) => {
  const logString = `[${new Date().toString()}]: ${req.method} ${req.path} (${req.requestId})`;
  console.log(logString);
  next();
});
app.use(express.static("./week-3-middleware/public"));

app.use("/", dogsRouter); // Do not remove this line

app.use((req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 400 && statusCode < 500) {
    console.warn(`WARN: ${err.name} - ${err.message}`);
  } else {
    console.error(`ERROR: ${err.name} - ${err.message}`);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal Server Error" : err.message,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
    requestId: req.requestId,
  });
});

if (esMain(import.meta)) {
  app.listen(3000, () => {
    console.log("Dog rescue app is listening on port 3000...");
  });
}

export default app;
