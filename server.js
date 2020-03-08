const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();

// For static files
app.use(express.static("dist"));

// Body parser for push requests
app.use(express.urlencoded({ extended: false }));

// Send index.html on '/' request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// Detect 404 request
app.get("*", (req, res) => {
  const result = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.status(404);
  res.end(`Cannot GET ${result}`);
});

// Use server on port
const port = 1234;
app.listen(port, () => {
  console.log("Listening at http://localhost:" + port);
});
