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

const serveGuestPage = (guestFile, reader, persist, template) => {
  const guestBook = readComments(guestFile, reader);
  return (req, res, next) => {
    const { pathname, method } = req;
    if (method === 'POST' && pathname === '/add-comment') {
      req.guestBook = guestBook;
      req.guestFile = guestFile;
      req.persist = persist;
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
      req.template = reader(template)
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
