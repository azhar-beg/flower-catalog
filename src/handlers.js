const fs = require('fs');
const COMMENTS = './data/comments.json';

const readJSON = () => JSON.parse(fs.readFileSync(COMMENTS, "utf8"));
const writeJSON = content => {
  fs.writeFileSync(COMMENTS, JSON.stringify(content), 'utf8');
}

const generateDiv = function (content, style) {
  return `<div>${content}</div>`;
};

const commentHtml = function ({ name, date, comment }) {
  return (
    generateDiv(date) +
    generateDiv(name) +
    generateDiv(comment)
  )

};

const getComments = function () {
  const rawComments = readJSON();
  return rawComments.map(comment => commentHtml(comment)).join('');
};

const guestBookHtml = function () {
  const comments = getComments();
  console.log('file', comments);
  const template = fs.readFileSync('./templates/guest-book.html', 'utf8');
  return template.replace(/__COMMENTS__/, comments);
};

const addComment = function (name, comment) {
  const comments = readJSON();
  const date = (new Date()).toString();
  comments.unshift({ name, date, comment })
  writeJSON(comments)
};

const serveGuestPage = function ({ uri, params }, response) {
  const { name, comment } = params;
  if (name && comment) {
    addComment(name, comment);
  }
  if (uri === '/guest-book') {
    response.send(guestBookHtml());
    return true
  }
  return false;
};

module.exports = { serveGuestPage };
