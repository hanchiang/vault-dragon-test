const { promisify } = require('util');

const redis = require('redis');
const log = require('../utils/logging');

let client;

exports.create = () => {
  if (!client) {
    client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    });
  }

  client.on('error', (err) => {
    log.error('Error ' + err);
  });
};

exports.get = () => client;

exports.getAsync = () => {
  if (client) {
    return {
      zaddAsync: promisify(client.zadd).bind(client),
      zrangeAsync: promisify(client.zrange).bind(client),
      zrangebyscoreAsync: promisify(client.zrangebyscore).bind(client),
      delAsync: promisify(client.del).bind(client),
      zscanAsync: promisify(client.zscan).bind(client),
    }
  }
}

exports.delete = async () => {
  if (client) {
    const flushdbAsync = promisify(client.flushdb).bind(client);
    const res = await flushdbAsync();
    log.info('Delete: ' + res);
  }
}