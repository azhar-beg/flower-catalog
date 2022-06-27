const { parseRequest } = require("./parseRequest.js");
const { Response } = require("./response.js");

const onData = (chunk, handler, response) => {
  const lines = chunk.toString().split('\r\n');
  const request = parseRequest(lines);
  handler(request, response);
};

const onNewConnection = (socket, handler) => {
  const response = new Response(socket);
  socket.on('data', (chunk) => onData(chunk, handler, response));
}

module.exports = { onNewConnection };
