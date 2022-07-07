const { serveApiPage } = require('./app/apiHandler.js');
const { serveGuestPage } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('./app/serveStatic.js');
const { createRouter } = require("./server/router");
const { injectCookies } = require('./app/injectCookies.js');
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
  serveApiPage('./data/comments.json'),
  serveStatic('./public'),
  notFound
];

const reqHandler = createRouter(handlers);
module.exports = { reqHandler };
