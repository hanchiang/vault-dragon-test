const express = require('express');
const bodyParser = require('body-parser');

const moment = require('moment');

const app = express();
app.use(bodyParser.json());

app.use((req, res) => {
  req.time = moment().unix();
});

module.exports = app;

