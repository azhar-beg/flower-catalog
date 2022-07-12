const {
  urlInstruction,
  nameKeyInstruction,
  commentKeyInstruction
} = require("../lib.js");


const serveInstruction = (req, res) => {
  const url = urlInstruction();
  const name = nameKeyInstruction();
  const comment = commentKeyInstruction;
  res.setHeader('content-type', 'text/html');
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
  if (name && comment) {
    const comments = selectComments(name, comment, req.guestBook);
    res.end(JSON.stringify(comments));
  }
};

const serveApiPage = (req, res, next) => {
  const { pathname, method } = req;
  if (pathname === '/api-page' && method === 'GET') {
    serveInstruction(req, res);
    return;
  }

  if (pathname === '/api/all' && method === 'GET') {
    res.end(req.guestBook.getComments());
    return;
  }

  if (pathname === '/api' && method === 'GET') {
    req.guestBook = guestBook
    serveApi(req, res);
    return;
  }
  next();
};

module.exports = { serveApiPage }
