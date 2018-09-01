const errorTransform = require('../tranforms/errorTransform');

exports.validateTimestamp = (req, res, next) => {
  const { timestamp } = req.query;
  if (!timestamp) return next();

  if (isNaN(timestamp)) {
    throw errorTransform('timestamp must be a number', 400);
  } else if (timestamp < 0) {
    throw errorTransform('timestamp must be a non-negative number', 400);
  }
  next();
}

exports.validateAddKey = (req, res, next) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

  // Check whether body is empty, i.e. not in the form of {key: value}
  if (keys.length === 0 && values.length === 0) {
    throw errorTransform('Body must contain a key value pair', 400);
  }

  // Check for null value, and objects with more than 1 key
  while(keys.length !== 0 && values.length !== 0) {
    if (keys.length > 1) {
      throw errorTransform('JSON value can only contain 1 key per key value', 400);
    } else if (typeof values[0] === 'string') {
      return next();
    } else if (values[0] === null) {
      throw errorTransform('null is not a valid value', 400);
    } else {
      keys = Object.keys(values[0]);
      values = Object.values(values[0]);
    }
  }
  return next();
}