/**
 * src/routes/api/authRoutes.js  — Person 3
 *
 * Mounts:
 *   POST /api/auth/login
 *
 * This file is registered in app.js (Person 1's file) as:
 *   app.use('/api/auth', require('./routes/api/authRoutes'));
 *
 * No CSRF needed here — API clients use JWT, not cookies.
 */

const express        = require('express');
const { apiLogin }   = require('../../controllers/api/apiAuthController');

const router = express.Router();

// POST /api/auth/login
router.post('/login', apiLogin);

module.exports = router;
