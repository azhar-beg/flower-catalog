const EOL = '\r\n';
const errorMessage = {
  200: 'ok',
  404: 'not found',
};

class Response {
  #socket;
  #statusCode;
  #headers;
  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#headers = {};
  }

  set statusCode(code) {
    this.#statusCode = code;
  }

  getErrorMessage() {
    const message = errorMessage[this.#statusCode];
    return message;
  }

  #response() {
    const code = this.#statusCode;
    return `HTTP/1.1 ${code} ${this.getErrorMessage()}${EOL}`;
  }

  #write(content) {
    this.#socket.write(content);
  }

  setHeaders(key, value) {
    this.#headers[key] = value;
  }

  #writeHeaders() {
    Object.entries(this.#headers).forEach(header => {
      this.#write(header[0] + ':' + header[1] + EOL);
    })
  }

  send(content) {
    this.#write(this.#response());
    this.setHeaders('content-length', content.length);
    this.#writeHeaders();
    this.#write(EOL);
    this.#write(content);
    this.#socket.end();
  }
}

module.exports = { Response };
