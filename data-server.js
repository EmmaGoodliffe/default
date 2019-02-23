const http = require('http');
const fs = require('fs');
const express = require('express');
let app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname+"/index.html");
});

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

// initialise the data
let theData = {"original": null};
fs.readFile('./public/data.json', 'utf-8', function (err, data) {
  if (err) {
    throw err;
  };
  theData = JSON.parse(data);
});

// get all the data
app.get('/data', function (req, res) {
  res.send(JSON.stringify(theData));
});

// clear the data
app.get('/clear', function (req, res) {
  theData = {};
  fs.writeFile('./public/data.json', "{}", (err) => {throw err;});
  res.send({
    "status": "successful"
  });
});

// delete something
app.delete('/:data_point', function (req, res) {
  let toBeDeleted = req.params.data_point;
  delete(theData[toBeDeleted]);
  let saveThis = JSON.stringify(theData);
  fs.writeFile('./public/data.json', saveThis, (err) => {throw err;});
  res.send(JSON.stringify(theData));
});

// search for something
app.get('/search/:data_point', function (req, res) {
  let point = req.params.data_point.toLocaleLowerCase();
  if (!theData[point]) {
    res.send({
      status: "not found",
      data_search: point
    });
  } else {
    res.send({
      status: "found",
      data_search: point,
      data: theData[point]
    });
  }
});

// add something
app.post('/add', function (req, res) {
  theData[req.body.dataKey.toLocaleLowerCase()] = req.body.dataValue;
  let saveThis = JSON.stringify(theData);
  fs.writeFile('./public/data.json', saveThis, (err) => {throw err;});
  res.end();
});

// add something through a get request
app.get('/add/:dataName/:data', function (req, res) {
  theData[req.params.dataName.toLocaleLowerCase()] = req.params.data;
  let saveThis = JSON.stringify(theData);
  fs.writeFile('./public/data.json', saveThis, (err) => {throw err;});
  res.send({
    status: "successful",
    data: {
      key: req.params.dataName.toLocaleLowerCase(),
      value: req.params.data
    }
  });
})

// app.get('/style.css', function (req, res) {
//   res.sendFile(__dirname+"/css/main.css");
// });

//add jquery and p5 here

app.get('*', function (req, res) {
  res.end("Page not found.");
});

const port = 3000;
app.listen(port, function () {
  console.log("Listening on port "+port);
});
