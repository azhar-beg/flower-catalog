const { serveGuestPage } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { notFoundHandler } = require('handlers');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('handlers');
const { createRouter } = require('http-server');
const { injectCookies } = require('handlers');
const { createLogoutHandler } = require('./app/logoutHandler.js');
const { createSignupHandler } = require('./app/signupHandler.js');

const app = config => {
  const handlers = [
    injectParams,
    injectCookies,
    injectSession(config.sessions),
    createLoginHandler(config.sessions, config.users),
    createSignupHandler(config.users),
    createLogoutHandler(config.sessions),
    serveGuestPage(config.comments, config.read, config.persist, config.guestTemp),
    serveStatic(config.publicDir),
    notFoundHandler
  ];
  return createRouter(...handlers)
};

module.exports = { app };
