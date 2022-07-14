const { redirectLoginPage } = require("./guestBookHandler");

const createLogoutHandler = ({ sessions }) => {
  return (req, res, next) => {
    const { pathname } = req;
    if (pathname !== '/logout') {
      next();
      return;
    }

    const { sessionId } = req.cookies;
    delete sessions[sessionId];
    res.setHeader('Set-Cookie', `sessionId=0;Max-age=0`);
    redirectLoginPage(res);
    res.end();
    return;
  };
};

module.exports = { createLogoutHandler };
