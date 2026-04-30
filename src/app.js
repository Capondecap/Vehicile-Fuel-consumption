require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const sessionMiddleware = require('./config/session');
const { csrfSynchronisedProtection, generateToken } = require('./config/csrf');
const authRoutes = require('./routes/web/authRoutes');
const recordRoutes = require('./routes/web/recordRoutes');
const apiAuthRoutes = require('./routes/api/authRoutes');
const apiRecordRoutes = require('./routes/api/recordRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'layouts'));
hbs.registerHelper('eq', (a, b) => a === b);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use((req, res, next) => {
  res.locals.csrfToken = generateToken(req);
  res.locals.username = req.session && req.session.username;
  next();
});

// Wrap every non-layout view in layouts/main.hbs so all pages share the same shell
app.use((req, res, next) => {
  const origRender = res.render.bind(res);
  res.render = function(view, options, fn) {
    if (typeof options === 'function') { fn = options; options = {}; }
    options = options || {};
    if (view.startsWith('layouts/')) return origRender(view, options, fn);
    origRender(view, options, function(err, html) {
      if (err) return fn ? fn(err) : next(err);
      origRender('layouts/main', { ...options, body: html }, fn || function(err2, out) {
        if (err2) return next(err2);
        res.send(out);
      });
    });
  };
  next();
});

app.use('/', authRoutes);
app.use('/records', recordRoutes);

app.use('/api/auth', apiAuthRoutes);
app.use('/api/records', apiRecordRoutes);

app.use(errorHandler);

module.exports = app;
