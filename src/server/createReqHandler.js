const { URL } = require('url');
const { storeComments, readComments, serveGuestPage, addNewComments } = require('../app/handlers.js');
const { notFound } = require('../app/notFoundHandler.js');
const { serveFileContent } = require('../app/serveFileContent.js');

const createReqHandler = handlers => (req, res) => {
  req.url = new URL(req.url, `http://${req.headers.host}`)
  for (const handler of handlers) {
    if (handler(req, res)) {
      return true;
    }
  }
}

const handlers = [storeComments(readComments()), addNewComments, serveFileContent, serveGuestPage, notFound];
const reqHandler = createReqHandler(handlers);

module.exports = { reqHandler };
