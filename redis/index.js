const redis = require('redis');

let client;

exports.create = () => {
  if (!client) {
    client = redis.createClient();
  }

  client.on('error', (err) => {
    console.log('Error ' + err);
  });
};

exports.get = () => client;

// TODO: For development only
// exports.delete = () => {
//   if (client) {
//     client.flushdb((err, res) => {
//       console.log(res);
//     })
//   }
// }


