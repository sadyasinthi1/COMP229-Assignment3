function errorHandler(err, _req, res, _next) {
  console.error('Request error:', err.message);
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Duplicate value: ' + Object.keys(err.keyValue || {}).join(', ') });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  res.status(500).json({ error: 'Internal server error' });
}
module.exports = { errorHandler };
