
module.exports = (message, status, cb) => {
  const err = new Error(message);
  err.status = status;
  return err;
}