/**
 * jwtMiddleware.js  — Person 3
 *
 * Guards all /api/* routes that require authentication.
 * Reads the token from the Authorization header:
 *   Authorization: Bearer <token>
 *
 * On success:  attaches `req.user = { id, username }` and calls next()
 * On failure:  returns a JSON 401/403 — never redirects (API contract)
 */

const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed. Expected: Bearer <token>',
    });
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Only expose what downstream handlers need
    req.user = { id: payload.id, username: payload.username };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token.' });
  }
}

module.exports = jwtMiddleware;
