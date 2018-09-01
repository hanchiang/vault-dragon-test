const { promisify } = require('util');

const moment = require('moment');

const redisClient = require('../redis').get();
const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
const zrangeAsync = promisify(redisClient.zrange).bind(redisClient);
const zrangebyscoreAsync = promisify(redisClient.zrangebyscore).bind(redisClient);
const zscanAsync = promisify(redisClient.zscan).bind(redisClient);
const errorTransform = require('../tranforms/errorTransform');

const timeFormat = 'h.mma';

exports.addKey = async (req, res) => {
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);

  const key = keys[0]
  const value = values[0];

  await zaddAsync(key, req.time, JSON.stringify(value))
  res.send({
    key,
    value,
    timestamp: moment.unix(req.time).format(timeFormat)
  })
};

exports.getValue = async (req, res) => {
  console.log(req.time);
  const { key } = req.params;
  const { timestamp } = req.query;
  let value = '';

  // const result = await zscanAsync(key, 0);
  // console.log(result);

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
  res.send({
    value: value
  })
  
}