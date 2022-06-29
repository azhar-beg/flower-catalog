const { URL } = require('url');

const router = handlers => (req, res) => {
  req.url = new URL(req.url, `http://${req.headers.host}`)
  for (const handler of handlers) {
    if (handler(req, res)) {
      return true;
    }
  }
};
exports.router = router;


