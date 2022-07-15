const { GuestBook } = require('./guestBook.js');

const readJSON = (file, read) => {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    return;
  }
};

const readComments = (fileName, reader) => {
  const commentList = readJSON(fileName, reader)?.reverse() || [];
  const guestBook = new GuestBook();
  commentList.forEach((comment) => {
    guestBook.addComment(comment);
  });
  return guestBook;
};

module.exports = { readComments };
