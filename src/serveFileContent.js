const fs = require('fs');

const determineType = (fileName) => {
  const index = fileName.lastIndexOf('.');
  const suffix = fileName.slice(index + 1);
  if (suffix === 'html') {
    return 'text/html';
  }
  if (suffix === 'jpg') {
    return 'image/jpg';
  }

  if (suffix === 'pdf') {
    return 'application/pdf';
  }
  return 'plain/text';
};

const serveFileContent = function (req, res) {
  const fileName = req.url.pathname === '/' ? '/home.html' : req.url.pathname;
  const path = `./public${fileName}`;
  console.log(path);

  if (!fs.existsSync(path)) {
    return false;
  }

  const content = fs.readFileSync(path);
  res.setHeader('content-type', determineType(path));
  res.end(content);
  return true;
};

module.exports = { serveFileContent };
