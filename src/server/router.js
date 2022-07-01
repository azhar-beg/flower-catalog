const createNext = handlers => {
  let index = -1;
  const callNextHandler = (req, res) => {
    index++;
    const currentHandler = handlers[index];
    if (currentHandler) {
      currentHandler(req, res, () => callNextHandler(req, res));
    }
  };
  return callNextHandler;
};

const createRouter = (handlers) => {
  return (req, res) => {
    const next = createNext(handlers);
    req.url = new URL(req.url, `http://${req.headers.host}`)
    next(req, res);
  };
};

module.exports = { createRouter };
