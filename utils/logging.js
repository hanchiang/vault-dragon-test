const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: 'han-vault-dragon',
  serializers: {
    err: bunyan.stdSerializers.err,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  }
});

module.exports = log;