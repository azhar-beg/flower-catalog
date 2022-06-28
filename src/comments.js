const fs = require('fs');

const generateDiv = function (content, style = '') {
  return `<div class="${style}">${content}</div>`;
};

const commentHtml = function ({ name, date, comment }) {
  return generateDiv(
    generateDiv(date.split(' G')[0], 'date') +
    generateDiv(name, 'name') +
    generateDiv(comment, 'message'), 'comment'
  )
};

const guestBookHtml = function (comments) {
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

  writeComments(file) {
    fs.writeFileSync(file, JSON.stringify(this.#comments), 'utf8');
  }

}

module.exports = { GuestBook };
