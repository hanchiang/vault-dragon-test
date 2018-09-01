const app = require('./app');
const redis = require('./redis');

const env = process.env.NODE_ENV || 'development';
if (env === 'test' || 'development') {
  require('dotenv').config({ path: '.env.test' })
}
redis.create();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Express is running on port ' + port);
})