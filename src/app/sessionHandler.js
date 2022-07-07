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
  const loginForm = fs.readFileSync(req.formTemplate);
  res.setHeader('content-type', 'text/html')
  res.end(loginForm);
  return;
};

const createLoginHandler = (sessions, loginFormFile) => {
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
      req.formTemplate = loginFormFile;
      serveLoginPage(req, res);
      return;
    }

    req.sessions = sessions;
    sessionsHandler(req, res);
  };
};

const createLogoutHandler = sessions => {
  return (req, res, next) => {
    const { pathname } = req;
    if (pathname !== '/logout') {
      next();
      return;
    }

    const { sessionId } = req.cookies;
    delete sessions[sessionId];
    res.setHeader('Set-Cookie', `sessionId=0;Max-age=0`)
    redirectLoginPage(res);
    res.end();
    return;
  };
};

module.exports = { createLoginHandler, injectSession, createLogoutHandler };
