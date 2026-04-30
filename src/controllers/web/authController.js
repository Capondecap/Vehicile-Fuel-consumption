const UserModel = require('../../models/User');

const getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/register', { title: 'Register' });
};

const postRegister = (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render('auth/register', {
      title: 'Register',
      error: 'All fields are required.',
    });
  }

  if (password !== confirmPassword) {
    return res.render('auth/register', {
      title: 'Register',
      error: 'Passwords do not match.',
    });
  }

  if (UserModel.findByUsername(username)) {
    return res.render('auth/register', {
      title: 'Register',
      error: 'Username already taken.',
    });
  }

  UserModel.create({ username, password });
  res.redirect('/login');
};

const getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Login' });
};

const postLogin = (req, res) => {
  const { username, password } = req.body;

  const user = UserModel.findByUsername(username);
  if (!user || user.password !== password) {
    return res.render('auth/login', {
      title: 'Login',
      error: 'Invalid username or password.',
    });
  }

  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/dashboard');
};

const postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports = { getRegister, postRegister, getLogin, postLogin, postLogout };
