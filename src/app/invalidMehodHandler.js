const methodHandler = expectedMethod => (req, res) => {
  if (req.method === expectedMethod) {
    return false;
  }
  res.statusCode = 405;
  res.setHeader('content-type', 'plain/text');
  res.end('invalid method');
  return true;
}

module.exports = { methodHandler }
