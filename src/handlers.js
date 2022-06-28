const fs = require('fs');
const { GuestBook } = require('./comments');
const PATH = '/guest-book';

const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    return false;
  }
};

const storeComments = (guestBook) => (request, response) => {
  request.guestBook = guestBook;
  return false;
}

const readComments = () => {
  const commentFile = './data/comments.json'
  const commentList = readJSON(commentFile).reverse() || [];
  const guestBook = new GuestBook();
  commentList.forEach((comment) => {
    guestBook.addComment(comment);
  });
  return guestBook;
}

const writeComments = function (name, comment, guestBook) {
  const date = (new Date()).toString();
  guestBook.addComment({ name, comment, date });
  guestBook.writeComments('./data/comments.json');
};

const addNewComments = function ({ uri, params, guestBook }) {
  const { name, comment } = params;
  if (name && comment && uri === PATH) {
    writeComments(name, comment, guestBook);
  }
  return false;
}

const serveGuestPage = function ({ uri, guestBook }, response) {
  console.log(guestBook);
  if (uri === PATH) {
    response.send(guestBook.createPage());
    return true
  }
  return false;
};

module.exports = { storeComments, readComments, addNewComments, serveGuestPage };
