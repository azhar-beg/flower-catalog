const { serveApiPage } = require('./app/apiHandler.js');
const { serveGuestPage } = require('./app/guestBookHandler.js');
const { loginHandler, injectSession, injectCookies, logOutHandler } = require('./app/sessionHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { injectParams } = require('./app/parseParams.js');
const { serveStatic } = require('./app/serveStatic.js');
const { createRouter } = require("./server/router");

const handlers = [
  injectParams,
  injectCookies,
  injectSession({}),
  loginHandler,
  logOutHandler,
  serveGuestPage('./data/comments.json'),
  serveApiPage('./data/comments.json'),
  serveStatic('./public'),
  notFound
];

const reqHandler = createRouter(handlers);
module.exports = { reqHandler };
