const { serveApiPage } = require('./app/apiHandler.js');
const { serveGuestPage } = require('./app/guestBookHandler.js');
const { loginHandler, injectSession, injectCookies, logOutHandler, createSessionsHandler } = require('./app/sessionHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('./app/serveStatic.js');
const { createRouter } = require("./server/router");

const sessions = {};
const handlers = [
  injectParams,
  injectCookies,
  injectSession(sessions),
  loginHandler,
  createSessionsHandler(sessions),
  logOutHandler,
  serveGuestPage('./data/comments.json'),
  serveApiPage('./data/comments.json'),
  serveStatic('./public'),
  notFound
];

const reqHandler = createRouter(handlers);
module.exports = { reqHandler };
