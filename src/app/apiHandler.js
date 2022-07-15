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
  if (name && comment) {
    const comments = selectComments(name, comment, req.guestBook);
    res.end(JSON.stringify(comments));
  }
};

const createApiHandler = guestBook => {
  return (req, res) => {
    const { url, method } = req;
    if (url === '/api-page' && method === 'GET') {
      serveInstruction(req, res);
      return;
    }

    if (url === '/api/all' && method === 'GET') {
      res.end((guestBook.getComments()));
      return;
    }

    if (url === '/api' && method === 'GET') {
      serveApi(req, res);
      return;
    }
  };
}
module.exports = { createApiHandler }
