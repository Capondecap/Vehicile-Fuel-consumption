require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const sessionMiddleware = require('./config/session');
const { csrfSynchronisedProtection, generateToken } = require('./config/csrf');
const authRoutes = require('./routes/web/authRoutes');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'layouts'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.csrfToken = generateToken(req);
  next();
});

app.use('/', authRoutes);

module.exports = app;
