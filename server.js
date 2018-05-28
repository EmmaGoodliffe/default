const http = require('http');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
let app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/index.html");
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/style.css', function (req, res) {
//   res.sendFile(__dirname+"/css/main.css");
// });

//add jquery and p5 here

app.get('*', function (req, res) {
  res.sendFile(__dirname+"/public/html/404.html");
});

const port = 3000;
app.listen(port, function () {
  console.log("Listening on port "+port);
});
