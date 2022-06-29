const parseValue = function (value) {
  let parsedValue = value;
  parsedValue = parsedValue.replace(/\+/g, ' ');
  parsedValue = parsedValue.replace(/\%27/g, '\'');
  parsedValue = parsedValue.replace(/\%2C/g, ',');
  parsedValue = parsedValue.replace(/\%0D\%0A/, '\n');
  return parsedValue;
};

const parseParams = rawParams => rawParams.split('&').reduce((params, param) => {
  const [key, value] = param.split('=');
  params[key] = parseValue(value);
  return params;
}, {});

const parseUri = rawUri => {
  console.log(rawUri);
  const [uri, rawParams] = rawUri.split('?');
  const params = rawParams ? parseParams(rawParams) : {};
  return { uri, params };
};

const parseRequestLine = line => {
  const [method, rawUri, httpVersion] = line.split(' ');
  return { method, ...parseUri(rawUri), httpVersion };
};

const splitHeader = line => {
  const splitOn = line.indexOf(' ');
  const key = line.slice(0, splitOn - 1).trim().toLowerCase();
  const value = line.slice(splitOn).trim();
  return [key, value];
};

const parseHeaders = lines => {
  const headers = {};
  let index = 0;
  while (lines.length > index && lines[index].length) {
    const [header, value] = splitHeader(lines[index]);
    headers[header] = value;
    index++;
  }
  return headers;
};

const parseRequest = (lines) => {
  const requestLine = parseRequestLine(lines[0]);
  const headers = parseHeaders(lines.splice(1));
  return { ...requestLine, headers };
};

module.exports = { parseRequest, parseHeaders };
