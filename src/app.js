const express = require('express');
const { createGuestBookRouter } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { injectCookies } = require('handlers');
const { createLogoutHandler } = require('./app/logoutHandler.js');
const { createSignupHandler } = require('./app/signupHandler.js');
const { readComments } = require('./app/readComments.js');
const { createApiRouter } = require('./app/apiHandler.js');

const changeUrl = (req, res, next) => {
  if (req.url === '/login' || req.url === '/signup') {
    req.url += '.html';
  }
  next();
};

const createApp = (config, fileOperation, userDetails) => {
  const app = express();
  const guestBook = readComments(config.guestFile, fileOperation.read);

  app.use(express.urlencoded({ extended: true }));
  app.use(injectCookies);
  app.use(injectSession(userDetails))

  app.get(/\/.*/, changeUrl)
  app.use('/guest-book', createGuestBookRouter(config, fileOperation, guestBook));
  app.post('/login', createLoginHandler(userDetails));
  app.post('/signup', createSignupHandler(userDetails, config, fileOperation));
  app.get('/logout', createLogoutHandler(userDetails));
  app.use('/api', createApiRouter(guestBook));

  app.use(express.static('public'));
  return app;
};

module.exports = { createApp };
