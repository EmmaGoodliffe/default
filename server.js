const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/index.html");
});

// app.use(express.static('src'));
app.use(express.urlencoded({ extended: false }));

app.get('*', function (req, res) {
  res.end("Page not found.");
});

const port = 3000;
app.listen(port, function () {
  console.log("Listening at http://localhost:" + port);
});
