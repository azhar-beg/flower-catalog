const { serveGuestPage } = require('./app/guestBookHandler.js');
const { notFound } = require('./app/notFoundHandler.js');
const { serveStatic } = require('./app/serveStatic.js');
const { router } = require("./server/router");

const handlers = [
  serveGuestPage('./data/comments.json'),
  serveStatic('./public'),
  notFound];

const reqHandler = router(handlers);
module.exports = { reqHandler };
