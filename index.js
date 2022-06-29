const http = require('http');

const { reqHandler } = require('./src/server/app.js');

const startServer = (PORT, requestHandler) => {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(8080, reqHandler);
