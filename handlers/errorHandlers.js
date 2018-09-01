
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  }
}

exports.notFound = (req, res, next) => {
  const err = new Error(`${req.path} can't be found`);
  err.status = 404;
  next(err);
};

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      type: err.name,
      msg: err.message
    }
  })
}