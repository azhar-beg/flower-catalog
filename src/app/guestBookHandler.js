const { readComments } = require("./readComments.js");

const getParams = url => {
  const params = {};
  for ([key, value] of url.searchParams.entries()) {
    params[key] = value
  }
  return params;
};

const addNewComments = (req, res, guestFile) => {
  const { guestBook, url } = req;
  const { name, comment } = getParams(url);
  if (name && comment) {
    guestBook.writeComments(name, comment, guestFile);
    res.statusCode = 302;
    res.setHeader('location', '/guest-book');
    res.end('');
    return true;
  }
  return false;
}

const showGuestPage = (req, res) => {
  const { guestBook } = req;
  res.end(guestBook.createPage());
  return true;
};

const serveGuestPage = guestFile => (req, res) => {
  const { url, method } = req;
  if (url.pathname === "/add-comment" && method === 'GET') {
    req.guestBook = readComments(guestFile);
    return addNewComments(req, res, guestFile);
  }

  if (url.pathname === '/guest-book' && method === 'GET') {
    req.guestBook = readComments(guestFile);
    return showGuestPage(req, res);
  }
  return false
}

module.exports = { serveGuestPage };
