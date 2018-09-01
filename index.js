const app = require('./app');
const redis = require('./redis');
redis.create();

const port = 3000;
const server = app.listen(port, () => {
  console.log('Express is running on port ' + port);
})