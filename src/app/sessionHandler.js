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

const doesUserExist = (username, password) => {
  const users = [
    { username: 'azhar', password: 'azhar' },
    { username: 'suresh', password: 'suresh' },
    { username: 'abin', password: 'abin' },
    { username: 'rishabh', password: 'rishabh' },
  ];
  return users.some(user => {
    return user.username === username && user.password === password;
  });
};

const sessionsHandler = (req, res) => {
  const { username, password } = req.params;
  if (!doesUserExist(username, password)) {
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

const createLoginHandler = (sessions, loginFormFile) => {
  const loginForm = fs.readFileSync(loginFormFile);
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

    if (req.method === 'GET') {
      req.loginForm = loginForm;
      serveLoginPage(req, res);
      return;
    }

    req.sessions = sessions;
    sessionsHandler(req, res);
  };
};

module.exports = { createLoginHandler, injectSession };
