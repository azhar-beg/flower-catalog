const { createHtml } = require("./guestBookHtml.js");
const express = require('express');

const showGuestPage = (req, res) => {
  const { guestBook } = req;
  res.end(createHtml(guestBook.getComments(), req.template));
};

const structureComment = ({ body, session }, lastId) => {
  const name = session.username;
  const { comment } = body;
  const id = (lastId || 0) + 1;
  const date = new Date().toLocaleString();

  return { name, comment, date, id }
};

const saveComments = function (req, res, persist) {
  req.setEncoding('utf8');
  const { guestBook, guestFile } = req;
  guestBook.addComment(structureComment(req, guestBook.latestCommentId()));
  persist(guestBook.getComments(), guestFile);
};

const validateSession = (req, res, next) => {
  if (!req.session) {
    res.redirect('/login.html')
    return;
  }
  next();
};

const loadGuestBook = guestBook => {
  return (req, res, next) => {
    req.guestBook = guestBook;
    next();
  }
}

const postComment = ({ guestFile }, { persist }) => {
  return (req, res) => {
    req.guestFile = guestFile;
    saveComments(req, res, persist);
    res.end('comment added');
  }
};

const showComments = ({ guestTemplate }, { read }) => {
  return (req, res) => {
    req.template = read(guestTemplate)
    showGuestPage(req, res);
  };
}

const createGuestBookRouter = (config, fileOperation, guestBook) => {
  const router = express.Router();
  router.use(validateSession);
  router.use(loadGuestBook(guestBook));
  router.post('/', postComment(config, fileOperation));
  router.get('/', showComments(config, fileOperation));
  return router;
};

module.exports = { createGuestBookRouter };
