const { promisify } = require('util');

const redis = require('redis');

let client;

exports.create = () => {
  if (!client) {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'test' || 'development') {
      require('dotenv').config({ path: '.env.test' })
    } else {
      require('dotenv');
    }
    client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    });
  }

  client.on('error', (err) => {
    console.log('Error ' + err);
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
      zscanAsync: promisify(client.zscan).bind(client)
    }
  }
}

// TODO: For development only
exports.delete = () => {
  if (client) {
    client.flushdb((err, res) => {
      console.log('Delete:' + res);
    })
  }
}