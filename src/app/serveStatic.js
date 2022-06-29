const fs = require('fs');
const path = require('path');

const determineType = (fileName) => {
  const extension = path.extname(fileName);
  const mimeTypes = {
    '.html': 'text/html',
    '.jpg': 'image/jpg',
    '.pdf': 'application/pdf',
    '.css': 'text/css',
    '.gif': 'image/gif',
  }
  return mimeTypes[extension] || 'plain/text';
};

const serveStatic = sourceRoot => function (req, res) {
  const fileName = req.url.pathname === '/' ? '/home.html' : req.url.pathname;
  const filePath = sourceRoot + fileName;
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const content = fs.readFileSync(filePath);
  res.setHeader('content-type', determineType(filePath));
  res.end(content);
  return true;
};

module.exports = { serveStatic };
