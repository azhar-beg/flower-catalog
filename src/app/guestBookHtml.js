const generateDiv = (content, style = '', id = '') => `<div id=${id} class="${style}">${content}</div>`;

const commentHtml = ({ name, date, comment, id }) => generateDiv(
  generateDiv(date, 'date') +
  generateDiv(name, 'name') +
  generateDiv(comment, 'message'), 'comment', id
);

const guestBookHtml = (comments, template) => {
  return template.replace(/__COMMENTS__/, comments);
};

const commentsHtml = (comments) => comments.map(commentHtml).join('')

const createHtml = (comments, template) => guestBookHtml(commentsHtml(JSON.parse(comments)), template)

module.exports = { createHtml };
