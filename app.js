const express = require('express');
const bodyParser = require('body-parser');

const moment = require('moment');

const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');
const log = require('./utils/logging');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  log.info({req});
  req.time = moment().unix();
  next();
});

app.use('/', routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports = app;

