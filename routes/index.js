const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers');
const routeController = require('../controllers');
const validator = require('../utils/validator');

router.get('/object/:key', 
  validator.validateTimestamp,
  catchErrors(routeController.getValue));

router.post('/object',
  validator.validateAddKey,
  catchErrors(routeController.addKey));

module.exports = router;