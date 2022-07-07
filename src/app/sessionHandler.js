const { redirectToGuestBook, redirectLoginPage } = require("./guestBookHandler");
const fs = require('fs');

const injectSession = sessions => {
  return (req, res, next) => {
    if (!req.cookies) {
      next();
      return
    }
    const { sessionId } = req.cookies;
    req.session = sessions[sessionId];
    next();
  }
}

const doesUserExist = (users, username, password) => {
  const user = users[username]
  if (user) {
    return user.password === password;
  }
  return false;
};

const sessionsHandler = (req, res) => {
  const { users, params } = req;
  const { username, password } = params;

  if (!doesUserExist(users, username, password)) {
    redirectLoginPage(res);
    return;
  }

  const sessions = req.sessions;
  const time = new Date();
  const sessionId = time.getTime();
  const session = { username, time, sessionId };
  sessions[sessionId] = session;
  res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
  redirectToGuestBook(res);
  return;
}


const serveLoginPage = (req, res) => {
  res.setHeader('content-type', 'text/html')
  res.end(req.loginForm);
  return;
};

const createLoginHandler = (sessions, users) => {
  return (req, res, next) => {
    const { pathname } = req;
    if (pathname !== '/login') {
      next();
      return;
    }

    if (req.session) {
      redirectToGuestBook(res);
      return;
    }

    req.users = users;
    req.sessions = sessions;
    sessionsHandler(req, res);
  };
};

module.exports = { createLoginHandler, injectSession };
