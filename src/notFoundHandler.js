const html = content => `<html><body>${content}</body></html>`;

const notFound = function (request, response) {
  response.statusCode = 404;
  response.send(html('Bad Request'));
  return true;
};

module.exports = { notFound };
