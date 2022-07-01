class GuestBook {
  #comments
  constructor() {
    this.#comments = [];
  }

  addComment(comment) {
    this.#comments.unshift(comment);
  }

  getComments() {
    return JSON.stringify(this.#comments)
  }
}

module.exports = { GuestBook };
