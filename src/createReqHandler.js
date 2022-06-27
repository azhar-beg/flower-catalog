const { serveHomePage } = require('./handlers.js');
const { notFound } = require('./notFoundHandler.js');

const createReqHandler = handlers => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response)) {
      return true;
    }
  }
}

const handlers = [serveHomePage, notFound];
const reqHandler = createReqHandler(handlers);

module.exports = { reqHandler };
