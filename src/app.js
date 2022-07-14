const { serveGuestPage } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { notFoundHandler } = require('handlers');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('handlers');
const { createRouter } = require('http-server');
const { injectCookies } = require('handlers');
const { createLogoutHandler } = require('./app/logoutHandler.js');
const { createSignupHandler } = require('./app/signupHandler.js');

const app = (config, fileOperation, userDetails) => {
  const handlers = [
    injectParams,
    injectCookies,
    injectSession(userDetails),
    createLoginHandler(userDetails, config, fileOperation),
    createSignupHandler(userDetails, config, fileOperation,),
    createLogoutHandler(userDetails),
    serveGuestPage(config, fileOperation),
    serveStatic(config.publicDir),
    notFoundHandler,
  ];
  return createRouter(...handlers)
};

module.exports = { app };
