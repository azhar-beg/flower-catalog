const { serveApiPage } = require('./app/apiHandler.js');
const { serveGuestPage } = require('./app/guestBookHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { parseParams } = require('./app/parseParams.js');
const { serveStatic } = require('./app/serveStatic.js');
const { createRouter } = require("./server/router");

const handlers = [
  parseParams,
  serveGuestPage('./data/comments.json'),
  serveApiPage('./data/comments.json'),
  serveStatic('./public'),
  notFound
];

const reqHandler = createRouter(handlers);
module.exports = { reqHandler };
