const { serveGuestPage, addNewComments } = require('./handlers.js');
const { notFound } = require('./notFoundHandler.js');
const { serveFileContent } = require('./serveFileContent.js');

const createReqHandler = handlers => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response)) {
      return true;
    }
  }
}

const handlers = [addNewComments, serveFileContent, serveGuestPage, notFound];
const reqHandler = createReqHandler(handlers);

module.exports = { reqHandler };
