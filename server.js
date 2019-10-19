const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

// For static files
// app.use(express.static('src'));

// Body parser for push requests
app.use(express.urlencoded({ extended: false }));

// Send index.html on '/' request
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Use server on port
const port = 3000;
app.listen(port, () => {
  console.log('Listening at http://localhost:' + port);
});
