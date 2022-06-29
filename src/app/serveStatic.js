const fs = require('fs');
const path = require('path');

const determineType = (fileName) => {
  const extension = path.extname(fileName);
  if (extension === '.html') {
    return 'text/html';
  }
  if (extension === '.jpg') {
    return 'image/jpg';
  }

  if (extension === '.pdf') {
    return 'application/pdf';
  }
  return 'plain/text';
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
