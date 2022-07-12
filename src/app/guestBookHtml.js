const fs = require('fs');

const generateDiv = (content, style = '', id = '') => `<div id=${id} class="${style}">${content}</div>`;

const commentHtml = ({ name, date, comment, id }) => generateDiv(
  generateDiv(date, 'date') +
  generateDiv(name, 'name') +
  generateDiv(comment, 'message'), 'comment', id
);

const guestBookHtml = (comments) => {
  const template = fs.readFileSync('./templates/guest-book.html', 'utf8');
  return template.replace(/__COMMENTS__/, comments);
};

const commentsHtml = (comments) => comments.map(commentHtml).join('')

const createHtml = (comments) => guestBookHtml(commentsHtml(JSON.parse(comments)))

module.exports = { createHtml };
