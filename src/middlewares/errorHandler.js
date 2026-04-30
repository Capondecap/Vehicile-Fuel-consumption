module.exports = function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (req.path.startsWith('/api/')) {
    return res.status(status).json({ success: false, message });
  }

  res.status(status).send(`<h1>Error ${status}</h1><p>${message}</p><a href="/">Home</a>`);
};
