const fs = require('fs');
const { GuestBook } = require('./guestBook.js');

const readJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return;
  }
};

const readComments = (fileName) => {
  const commentList = readJSON(fileName)?.reverse() || [];
  const guestBook = new GuestBook();
  commentList.forEach((comment) => {
    guestBook.addComment(comment);
  });
  return guestBook;
};

module.exports = { readComments };
