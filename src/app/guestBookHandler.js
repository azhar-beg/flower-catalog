const { serveApiPage } = require('./apiHandler.js');
const { createHtml } = require("./guestBookHtml.js");
const { readComments } = require("./readComments.js");

const redirectToGuestBook = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/guest-book');
  res.end('redirected to /guest-book');
};

const redirectLoginPage = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/login.html');
  res.end('redirected to /login.html');
};

const writeGuestBook = (req, res) => {
  const { guestBook, bodyParams, guestFile, session } = req;
  const name = session.username;
  const { comment } = bodyParams;
  const id = (guestBook.latestCommentId() || 0) + 1;

  const date = new Date().toLocaleString();
  guestBook.addComment({ name, comment, date, id });
  req.persist(guestBook.getComments(), guestFile);
}

const showGuestPage = (req, res) => {
  const { guestBook } = req;
  res.end(createHtml(guestBook.getComments(), req.template));
};

const saveComments = function (req, res) {
  req.setEncoding('utf8');
  writeGuestBook(req, res);
};

const serveGuestPage = ({ guestFile, guestTemplate }, { read, persist }) => {
  const guestBook = readComments(guestFile, read);
  return (req, res, next) => {
    const { pathname, method } = req;
    if (pathname.startsWith('/api')) {
      req.guestBook = guestBook;
      serveApiPage(req, res, next);
      return;
    }

    if (pathname !== '/guest-book' && pathname !== '/add-comment') {
      next();
      return;
    }

    if (!req.session) {
      redirectLoginPage(res);
      return;
    }

    if (method === 'POST') {
      req.guestBook = guestBook;
      req.guestFile = guestFile;
      req.persist = persist;
      saveComments(req, res);
      res.end('comment added');
      return;
    }

    if (method === 'GET') {
      req.guestBook = guestBook;
      req.template = read(guestTemplate)
      showGuestPage(req, res);
      return;
    }
  }
}

module.exports = { serveGuestPage, redirectToGuestBook, redirectLoginPage };
