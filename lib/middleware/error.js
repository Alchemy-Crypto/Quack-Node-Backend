// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.status || 500;
  const reason = Object.entries(err.data)[0][1].reason;
  res.status(status);

  res.send({
    reason,
    status,
    message: err.message
  });
};
