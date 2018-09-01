module.exports = () => {
  const app = require('../app');
  require('../redis').create();

  const port = 3000;
  const server = app.listen(port, () => {
    // console.log('Express is running on port ' + port);
  })
  return server;
}