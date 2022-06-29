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

class GuestBook {
  #comments
  constructor() {
    this.#comments = [];
  }

  addComment(comment) {
    this.#comments.unshift(comment);
  }

  #commentHtml() {
    return this.#comments.map(commentHtml).join('');
  }

  createPage() {
    return guestBookHtml(this.#commentHtml())
  }

  writeComments(name, comment, file) {
    const date = (new Date()).toLocaleString();
    this.addComment({ name, comment, date });
    fs.writeFileSync(file, JSON.stringify(this.#comments), 'utf8');
  }
}

module.exports = { GuestBook };
