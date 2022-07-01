const fs = require('fs');
const { writeContent, getParams } = require('../lib.js');
const { createHtml } = require("./guestBookHtml.js");
const { readComments } = require("./readComments.js");

const writeGuestBook = (req, res) => {
  const { guestBook, url, guestFile } = req;
  const { name, comment } = getParams(url.params);
  const date = new Date().toLocaleString();
  guestBook.addComment({ name, comment, date });
  writeContent(guestBook.getComments(), guestFile);

  res.statusCode = 302;
  res.setHeader('location', '/guest-book');
  res.end();
}

const showGuestPage = (req, res) => {
  const { guestBook } = req;
  res.end(createHtml(guestBook.getComments()));
};

const saveComments = function (req, res) {
  req.setEncoding('utf8');
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    req.url.params = new URLSearchParams(data);
    writeGuestBook(req, res);
  })
};

const serveGuestPage = guestFile => {
  const guestBook = readComments(guestFile);
  return (req, res, next) => {
    const { url, method } = req;
    const { pathname } = url;

    if (pathname === "/add-comment" && method === 'POST') {
      req.guestBook = guestBook;
      req.guestFile = guestFile;
      saveComments(req, res);
      return;
    }

    if (pathname === '/guest-book' && method === 'GET') {
      req.guestBook = guestBook;
      showGuestPage(req, res);
      return;
    }
    next()
  }
}

module.exports = { serveGuestPage, getParams };
