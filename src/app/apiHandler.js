const express = require('express')
const {
  urlInstruction,
  nameKeyInstruction,
  commentKeyInstruction
} = require("../lib.js");


const serveInstruction = (req, res) => {
  const url = urlInstruction();
  const name = nameKeyInstruction();
  const comment = commentKeyInstruction;
  res.type('html');
  res.end(`${url}<div>${name}\n${comment}</div>`);
};

const selectComments = (name, comment, guestBook) => {
  name = name === 'all' ? '' : name;
  comment = comment === 'all' ? '' : comment;
  const comments = JSON.parse(guestBook.getComments());
  return comments.filter((entry) => {
    return entry.name.includes(name) && entry.comment.includes(comment);
  })
};

const serveApi = (req, res) => {
  const { name, comment } = req.params;
  if (!(name || comment)) {
    res.end((req.guestBook.getComments()));
    return;
  }

  if (name && comment) {
    const comments = selectComments(name, comment, req.guestBook);
    res.JSON(comments);
  }
};

const createApiRouter = (guestBook) => {
  const router = express.Router();
  router.get('/instruction', (req, res) => {
    serveInstruction(req, res);
  });

  router.get('/', ((guestBook) => (req, res) => {
    req.guestBook = guestBook;
    serveApi(req, res);
  })(guestBook));
  return router;
};


module.exports = { createApiRouter }
