const fs = require('fs');
const { GuestBook } = require('./guestBook.js');

const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    return;
  }
};

const storeComments = (guestBook) => (request, response) => {
  const { pathname } = request.url;
  if (pathname === '/guest-book' || pathname === '/add-comment') {
    request.guestBook = guestBook;
  }
  return false;
}

const readComments = (fileName) => {
  const commentList = readJSON(fileName)?.reverse() || [];
  const guestBook = new GuestBook();
  commentList.forEach((comment) => {
    guestBook.addComment(comment);
  });
  return guestBook;
}

const getParams = url => {
  const params = {};
  for ([key, value] of url.searchParams.entries()) {
    params[key] = value
  }
  return params;
};

const addNewComments = function (req, res) {
  const { guestBook, url } = req;
  const { name, comment } = getParams(url);
  if (url.pathname === "/add-comment" && name && comment) {
    guestBook.writeComments(name, comment, './data/comments.json');
    res.statusCode = 302;
    res.setHeader('location', '/guest-book');
    res.end('');
    return true;
  }
  return false;
}

const serveGuestPage = function (req, res) {
  const { url, guestBook } = req
  if (url.pathname === '/guest-book') {
    res.end(guestBook.createPage());
    return true
  }
  return false;
};

module.exports = { storeComments, readComments, addNewComments, serveGuestPage };
