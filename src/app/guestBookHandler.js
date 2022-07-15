const { createHtml } = require("./guestBookHtml.js");

const writeGuestBook = (req, res) => {
  const { guestBook, body, guestFile, session } = req;
  const name = session.username;
  const { comment } = body;
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

const validateSession = (req, res, next) => {
  if (!req.session) {
    res.redirect('/login.html')
    return;
  }
  next();
};

const postComment = ({ guestFile }, { persist }, guestBook) => {
  return (req, res) => {
    req.guestBook = guestBook;
    req.guestFile = guestFile;
    req.persist = persist;
    saveComments(req, res);
    res.end('comment added');
    return;
  }
};

const showComments = ({ guestTemplate }, { read }, guestBook) => {
  return (req, res) => {
    req.guestBook = guestBook;
    req.template = read(guestTemplate)
    showGuestPage(req, res);
    return;
  };
}

module.exports = { validateSession, postComment, showComments };
