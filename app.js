const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const moment = require('moment');
const helmet = require('helmet');

const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');


app.use(bodyParser.json());

app.use((req, res, next) => {
  req.time = moment().unix();
  next();
});

app.use(helmet());

app.use('/', routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

module.exports = app;

