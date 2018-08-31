const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');

client.on('error', (err) => {
  console.log('Error ' + err);
})
