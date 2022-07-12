const { serveGuestPage } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { notFoundHandler } = require('handlers');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('handlers');
const { createRouter } = require('http-server');
const { injectCookies } = require('handlers');
const { createLogoutHandler } = require('./app/logoutHandler.js');
const { createSignupHandler } = require('./app/signupHandler.js');

const sessions = {};

const users = {
  azhar: { username: 'azhar', password: 'azhar' },
  suresh: { username: 'suresh', password: 'suresh' },
  abin: { username: 'abin', password: 'abin' },
  rishabh: { username: 'rishabh', password: 'rishabh' },
};

const handlers = [
  injectParams,
  injectCookies,
  injectSession(sessions),
  createLoginHandler(sessions, users, './templates/login.html'),
  createSignupHandler(users),
  createLogoutHandler(sessions),
  serveGuestPage('./data/comments.json'),
  serveStatic('./public'),
  notFoundHandler
];

const router = createRouter(...handlers);
module.exports = { router };
