const moment = require('moment');

const myRedis = require('../redis');
const errorTransform = require('../tranforms/errorTransform');

const timeFormat = 'h.mma';

exports.addKey = async (req, res) => {
  const { zaddAsync } = myRedis.getAsync();

  const key = Object.keys(req.body)[0]
  const value = Object.values(req.body)[0];

  await zaddAsync(key, req.time, JSON.stringify(value))
  res.json({
    key,
    value,
    timestamp: moment.unix(req.time).format(timeFormat)
  })
};

exports.getValue = async (req, res) => {
  const { zrangeAsync, zrangebyscoreAsync } = myRedis.getAsync();
  const { key } = req.params;
  const { timestamp } = req.query;
  let value = '';

  if (timestamp) {
    const result = await zrangebyscoreAsync(key, 0, timestamp);
    if (result.length === 0) {
      throw errorTransform('No result found', 404);
    }
    value = JSON.parse(result[result.length - 1]);
  } else {
    const result = await zrangeAsync(key, -1, -1);
    if (result.length === 0) {
      throw errorTransform(`key '${key}' does not exist`, 404)
    }
    value = JSON.parse(result[0]);
  }
  res.json({value});
}