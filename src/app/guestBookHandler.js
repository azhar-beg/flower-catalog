const { writeContent } = require('../lib.js');
const { createHtml } = require("./guestBookHtml.js");
const { readComments } = require("./readComments.js");

const isSessionExist = (req) => {
  const { sessions, cookies } = req;
  if (!cookies) {
    return false;
  }
  const { sessionId } = cookies;
  return sessionId && sessions[sessionId];
};


const redirectToGuestBook = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/guest-book');
  res.end();
};

const redirectLoginPage = (res) => {
  res.statusCode = 302;
  res.setHeader('location', '/login');
  res.end();
};

const writeGuestBook = (req, res) => {
  const { guestBook, params, guestFile, sessions, cookies } = req;
  const { sessionId } = cookies;
  const name = sessions[sessionId].username;
  const { comment } = params;

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
    if (pathname !== '/guest-book') {
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

    if (!isSessionExist(req)) {
      redirectLoginPage(res);
      return;
    }

    req.guestBook = guestBook;
    showGuestPage(req, res);
  }
}

module.exports = { serveGuestPage, redirectToGuestBook, isSessionExist, redirectLoginPage };
