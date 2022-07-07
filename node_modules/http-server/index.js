const http = require('http');
const { createRouter } = require('./src/router');

const startServer = (PORT, requestHandler) => {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

module.exports = { startServer, createRouter };
