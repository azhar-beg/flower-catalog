const { createServer } = require('net');
const { reqHandler } = require('./src/createReqHandler.js');
const { onNewConnection } = require('./src/onConnection.js');

const startServer = function (PORT, requestHandler) {
  const server = createServer((socket) => onNewConnection(socket, requestHandler));
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(8080, reqHandler);
