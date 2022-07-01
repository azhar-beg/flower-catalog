const { getParams,
  urlInstruction,
  nameKeyInstruction,
  commentKeyInstruction
} = require("../lib.js");

const { readComments } = require("./readComments.js");

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
  const { name, comment } = getParams(req.url.searchParams);
  if (name && comment) {
    const comments = selectComments(name, comment, req.guestBook);
    res.end(JSON.stringify(comments));
  }
};

const serveApiPage = guestFile => {
  const guestBook = readComments(guestFile);
  return (req, res, next) => {
    const { url, method } = req;
    const { pathname } = url;
    if (pathname === '/api-page' && method === 'GET') {
      serveInstruction(req, res);
      return;
    }

    if (pathname === '/api' && method === 'GET') {
      req.guestBook = guestBook
      serveApi(req, res);
      return;
    }
    next();
  }
}

module.exports = { serveApiPage }
