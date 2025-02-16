var express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    PORT = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
	  request = require('request'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    cors = require('cors'),
    axios = require('axios');
    require('dotenv').config();

var server = require('http').createServer(app);
app.use(cors());
app.options('*', cors())
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json());
app.use(methodOverride())
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.use(function (err, req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept, multipart/form-data; boundary=<calculated when request is sent>"
  );
  next('err',err)
});

app.get('/', function(req, res) {
  res.status(200).send({ message: 'Success' })
});

function logErrors (err, req, res, next) {
  console.error('errss',err)
  next(err)
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}


require('./routes/route.config')(app);


async function init() {

  console.log(`Starting Express example on port ${PORT}...`);

  server.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}. Try some routes`);
  });
}

init();
