const errorTransform = require('../tranforms/errorTransform');


exports.validateAddKey = (req, res, next) => {
  let keys = Object.keys(req.body);
  let values = Object.values(req.body);

  // Check whether body is empty, i.e. not in the form of {key: value}
  if (keys.length === 0 && values.length === 0) {
    throw errorTransform('Body must contain a key value pair', 400);
  }

  if (typeof values[0] === 'string') {
    next();
  } else {
    while (typeof values[0] === 'object' && keys.length !== 0 && values.length !== 0) {
      keys = Object.keys(values[0]);
      values = Object.values(values[0]);

      // If value is a nested object, check that it has only one key
      if (keys.length > 1) {
        throw errorTransform('JSON value can only contain 1 key per key value', 400);
      }
      if (values[0] === null) {
        throw errorTransform('null is not a valid value', 400);
      }
    }
    next();
  }
}