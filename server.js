const http = require('http');

const { reqHandler } = require('./src/createReqHandler.js');

const startServer = function (PORT, requestHandler) {
  const server = http.createServer(requestHandler)
  // const server = createServer((socket) => onNewConnection(socket, requestHandler));
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(8080, reqHandler);
