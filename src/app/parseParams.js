const { getParams } = require("../lib");

const parseParams = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      req.params = getParams(new URLSearchParams(data));
      req.pathname = req.url.pathname
      console.log(req.pathname);
      next();
    })
  } else {
    const url = new URL(req.url, `http://${req.headers.host}`)
    req.pathname = url.pathname;
    req.params = getParams(url.searchParams)
    console.log(req.pathname, req.params);
    next();
  }
};

module.exports = { parseParams };
