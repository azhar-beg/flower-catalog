const serveHomePage = function (request, response) {
  response.send('this is a home page')
};

module.exports = { serveHomePage };
