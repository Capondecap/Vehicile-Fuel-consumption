/**
 * apiAuthController.js  — Person 3
 *
 * Handles:
 *   POST /api/auth/login    → validates credentials, returns signed JWT
 *   POST /api/auth/register → (optional extra, defers to P1's userService)
 *
 * This controller is API-only (returns JSON).
 * Session-based auth lives in src/controllers/web/authController.js (Person 1).
 */

const jwt = require('jsonwebtoken');

const userService = require('../../services/userService');

// ---------------------------------------------------------------------------
// POST /api/auth/login
// Body: { username, password }
// ---------------------------------------------------------------------------
async function apiLogin(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username and password are required.',
      });
    }

    const user = await userService.findByUsername(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // P1's userService.verifyPassword handles bcrypt comparison.
    // The mock above does a plain string compare for local testing.
    const valid = await userService.verifyPassword(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      expiresIn: 7200, // seconds
    });
  } catch (err) {
    return next(err); // handed to P1's errorHandler middleware
  }
}

module.exports = { apiLogin };
