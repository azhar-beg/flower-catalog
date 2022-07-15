const express = require('express');
const { validateSession, postComment, showComments } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { injectCookies } = require('handlers');
const { createLogoutHandler } = require('./app/logoutHandler.js');
const { createSignupHandler } = require('./app/signupHandler.js');
const { readComments } = require('./app/readComments.js');
const { createApiHandler } = require('./app/apiHandler.js');

const createApp = (config, fileOperation, userDetails) => {
  const app = express();
  const guestBook = readComments(config.guestFile, fileOperation.read);

  app.use(express.urlencoded({ extended: true }));
  app.use(injectCookies);
  app.use(injectSession(userDetails))


  const guestBookRouter = express.Router();
  app.use('/guest-book', guestBookRouter);
  guestBookRouter.use(validateSession);
  guestBookRouter.post('/', postComment(config, fileOperation, guestBook));
  guestBookRouter.get('/', showComments(config, fileOperation, guestBook));

  app.post('/login', createLoginHandler(userDetails));
  app.use('/login', express.static('public/login.html'));

  app.post('/signup', createSignupHandler(userDetails, config, fileOperation));
  app.use('/signup', express.static('public/signup.html'));

  app.get('/logout', createLogoutHandler(userDetails));


  app.get(/\/api.*/, createApiHandler(guestBook));
  app.use(express.static('public'));
  return app;
};

module.exports = { createApp };
