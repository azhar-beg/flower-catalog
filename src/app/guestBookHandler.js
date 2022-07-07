const { writeContent } = require('../lib.js');
const { createHtml } = require("./guestBookHtml.js");
const { readComments } = require("./readComments.js");

const redirectToGuestBook = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/guest-book');
  res.end();
};

const redirectLoginPage = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/login.html');
  res.end();
};

const writeGuestBook = (req, res) => {
  const { guestBook, bodyParams, guestFile, session } = req;
  const name = session.username;
  const { comment } = bodyParams;

  const date = new Date().toLocaleString();
  guestBook.addComment({ name, comment, date });
  writeContent(guestBook.getComments(), guestFile);
}

const showGuestPage = (req, res) => {
  const { guestBook } = req;
  res.end(createHtml(guestBook.getComments()));
};

const saveComments = function (req, res) {
  req.setEncoding('utf8');
  writeGuestBook(req, res);
};

const serveGuestPage = guestFile => {
  const guestBook = readComments(guestFile);
  return (req, res, next) => {
    const { pathname, method } = req;
    if (pathname !== '/guest-book' && pathname !== '/add-comment') {
      next()
      return;
    }

    if (method === 'POST') {
      req.guestBook = guestBook;
      req.guestFile = guestFile;
      saveComments(req, res);
      redirectToGuestBook(res);
      return;
    }

    if (!req.session) {
      redirectLoginPage(res);
      return;
    }

    req.guestBook = guestBook;
    showGuestPage(req, res);
  }
}

module.exports = { serveGuestPage, redirectToGuestBook, redirectLoginPage };
