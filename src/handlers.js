const fs = require('fs');
const COMMENTS = './data/comments.json';
const PATH = '/guest-book';
const TEMPLATE = './templates/guest-book.html';

const generateDiv = function (content, style = '') {
  return `<div class="${style}">${content}</div>`;
};

const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJSON = content => {
  fs.writeFileSync(COMMENTS, JSON.stringify(content), 'utf8');
}

const commentHtml = function ({ name, date, comment }) {
  return generateDiv(
    generateDiv(date.split(' G')[0], 'date') +
    generateDiv(name, 'name') +
    generateDiv(comment, 'message'), 'comment'
  )
};

const getComments = function () {
  const rawComments = readJSON(COMMENTS);
  return rawComments.map(comment => commentHtml(comment)).join('');
};

const guestBookHtml = function () {
  const comments = getComments();
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  return template.replace(/__COMMENTS__/, comments);
};

const addComment = function (name, comment) {
  const comments = readJSON(COMMENTS);
  const date = (new Date()).toString();
  comments.unshift({ name, date, comment })
  writeJSON(comments)
};

const serveGuestPage = function ({ uri, params }, response) {
  const { name, comment } = params;
  if (name && comment && uri === PATH) {
    addComment(name, comment);
  }
  if (uri === PATH) {
    response.send(guestBookHtml());
    return true
  }
  return false;
};

module.exports = { serveGuestPage };
