const html = content => `<html><body>${content}</body></html>`;

const notFound = function (request, response) {
  response.statusCode = 404;
  response.end(html('Bad Request'));
  return;
};

module.exports = { notFound };
