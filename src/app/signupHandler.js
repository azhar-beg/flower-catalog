const fs = require('fs');
const { redirectLoginPage } = require('./guestBookHandler');

const createSignupHandler = (users) => {
  return (req, res, next) => {
    const { pathname, method } = req;
    if (pathname !== '/signup') {
      next();
      return;
    }

    const { username, password } = req.params;
    users[username] = { username, password };
    redirectLoginPage(res);
    res.end()
    return;
  }
};

module.exports = { createSignupHandler };
