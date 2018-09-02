const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'han-vault-dragon',
  serializers: {
    err: bunyan.stdSerializers.err,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  }
});

// Disable logging when running tests
if (process.env.NODE_ENV === 'test') {
  log.level(bunyan.FATAL + 1);
}
module.exports = log;