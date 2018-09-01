const express = require('express');
const bodyParser = require('body-parser');

const moment = require('moment');

require('./redis').create();
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.time = moment().unix();
  next();
});

app.use('/', routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports = app;

