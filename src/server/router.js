const { URL } = require('url');
const { storeComments, readComments, serveGuestPage, addNewComments } = require('../app/guestBookHandler.js');
const { notFound } = require('../app/notFoundHandler.js');
const { serveStatic } = require('../app/serveStatic.js');

const router = handlers => (req, res) => {
  req.url = new URL(req.url, `http://${req.headers.host}`)
  for (const handler of handlers) {
    if (handler(req, res)) {
      return true;
    }
  }
}

const handlers = [storeComments(readComments('./data/comments.json')),
  addNewComments,
serveStatic('./public'),
  serveGuestPage,
  notFound];

const reqHandler = router(handlers);

module.exports = { reqHandler };
