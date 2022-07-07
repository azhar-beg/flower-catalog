const { serveApiPage } = require('./app/apiHandler.js');
const { serveGuestPage } = require('./app/guestBookHandler.js');
const { createLoginHandler, injectSession } = require('./app/sessionHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('./app/serveStatic.js');
const { createRouter } = require("./server/router");
const { injectCookies } = require('./app/injectCookies.js');
const { createLogoutHandler } = require('./app/logoutHandler.js');

const sessions = {};
const handlers = [
  injectParams,
  injectCookies,
  injectSession(sessions),
  createLoginHandler(sessions, './templates/login.html'),
  createLogoutHandler(sessions),
  serveGuestPage('./data/comments.json'),
  serveApiPage('./data/comments.json'),
  serveStatic('./public'),
  notFound
];

const reqHandler = createRouter(handlers);
module.exports = { reqHandler };
