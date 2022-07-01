const fs = require('fs');
const { createHtml } = require("./guestBookHtml.js");
const { readComments } = require("./readComments.js");

const writeContent = function (content, file) {
  fs.writeFileSync(file, content, 'utf8');
}


const getParams = searchParams => {
  const params = {};
  for ([key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params;
};

const writeGuestBook = (req, res, guestFile) => {
  const { guestBook, url } = req;
  const { name, comment } = getParams(url.params);
  if (!name || !comment) {
    return;
  }
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

const serveGuestPage = guestFile => {
  const guestBook = readComments(guestFile);
  return (req, res, next) => {
    const { url, method } = req;
    const { pathname } = url;
    if (pathname === "/add-comment" && method === 'POST') {
      req.setEncoding('utf8');
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        req.url.params = new URLSearchParams(data);
        req.guestBook = guestBook
        writeGuestBook(req, res, guestFile);
      })
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
