const { redirectLoginPage } = require('./guestBookHandler');

const createSignupHandler = ({ users }, { userFile }, { persist }) => {
  return (req, res, next) => {
    const { pathname, method } = req;
    if (pathname !== '/signup') {
      next();
      return;
    }

    const { username, password } = req.bodyParams;
    if (users[username]) {
      res.statusCode = 409;
      res.end('conflict');
      return;
    }

    users[username] = { username, password };
    persist(JSON.stringify(users), userFile);
    redirectLoginPage(res);
    return;
  }
};

module.exports = { createSignupHandler };
