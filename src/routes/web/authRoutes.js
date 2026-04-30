const express = require('express');
const router = express.Router();
const { csrfSynchronisedProtection } = require('../../config/csrf');
const { requireAuth } = require('../../middlewares/auth');
const {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  postLogout,
} = require('../../controllers/web/authController');

router.get('/', (req, res) => res.redirect('/login'));

router.get('/register', getRegister);
router.post('/register', csrfSynchronisedProtection, postRegister);

router.get('/login', getLogin);
router.post('/login', csrfSynchronisedProtection, postLogin);

router.post('/logout', csrfSynchronisedProtection, postLogout);

// Dashboard route — protected; view + CRUD wired by Person 2
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard/index', {
    title: 'Dashboard',
    username: req.session.username,
  });
});

module.exports = router;
