const fs = require('fs');

const generateDiv = (content, style = '') => `<div class="${style}">${content}</div>`;

const commentHtml = ({ name, date, comment }) => generateDiv(
  generateDiv(date, 'date') +
  generateDiv(name, 'name') +
  generateDiv(comment, 'message'), 'comment'
);

const guestBookHtml = (comments) => {
  const template = fs.readFileSync('./templates/guest-book.html', 'utf8');
  return template.replace(/__COMMENTS__/, comments);
};

const commentsHtml = (comments) => comments.map(commentHtml).join('')

const createHtml = (comments) => guestBookHtml(commentsHtml(JSON.parse(comments)))

module.exports = { createHtml };
