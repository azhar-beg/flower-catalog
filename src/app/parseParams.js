const { getParams } = require("../lib");

const injectParams = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      req.params = getParams(new URLSearchParams(data));
      req.pathname = req.url.pathname
      next();
    })

  } else {
    const url = new URL(req.url, `http://${req.headers.host}`)
    req.pathname = url.pathname;
    req.params = getParams(url.searchParams)
    next();
  }
};

module.exports = { injectParams };
