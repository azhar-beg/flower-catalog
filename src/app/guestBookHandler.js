const { writeContent } = require('../lib.js');
const { serveApiPage } = require('./apiHandler.js');
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
  const id = (guestBook.latestCommentId() || 0) + 1;

  const date = new Date().toLocaleString();
  guestBook.addComment({ name, comment, date, id });
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
    if (method === 'POST' && pathname === '/add-comment') {
      req.guestBook = guestBook;
      req.guestFile = guestFile;
      saveComments(req, res);
      res.end();
      return;
    }

    if (!req.session && pathname === '/guest-book') {
      redirectLoginPage(res);
      return;
    }

    if (pathname === '/guest-book' && method === 'GET') {
      req.guestBook = guestBook;
      showGuestPage(req, res);
      return;
    }

    if (pathname.startsWith('/api')) {
      req.guestBook = guestBook;
      serveApiPage(req, res, next);
      return;
    }
    next();
  }
}

module.exports = { serveGuestPage, redirectToGuestBook, redirectLoginPage };
