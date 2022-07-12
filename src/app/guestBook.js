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

  latestCommentId() {
    if (this.#comments[0]) {
      return this.#comments[0].id;
    }
  }
}

module.exports = { GuestBook };
