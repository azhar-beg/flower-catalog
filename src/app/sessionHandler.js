const { redirectToGuestBook, isSessionExist, redirectLoginPage } = require("./guestBookHandler");

const loginForm = `<html lang="en">

<head>
  <title>Login</title>
</head>

<body>
  <form action="/login" method="post">
    <div>
      <label for="username">Enter Your Name</label>
      <input type="text" name="username" id="">
    </div>
    <div>
      <label for="username">Enter Your Password</label>
      <input type="text" name="password" id="">
    </div>
    <input type="submit" value="Login">
  </form>
</body>

</html>`

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

const injectSession = sessions => {
  return (req, res, next) => {
    req.sessions = sessions;
    next();
  }
}

const parseCookies = (rawCookies) => {
  if (!rawCookies) {
    return;
  }
  const cookies = {};
  rawCookies.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=');
    cookies[key] = value;
  })
  return cookies;
};

const injectCookies = (req, res, next) => {
  req.cookies = parseCookies(req.headers.cookie)
  next()
};

const loginHandler = (req, res, next) => {
  const { pathname } = req;
  if (pathname !== '/login') {
    next();
    return;
  }

  const { username, password } = req.params;
  if (req.method === 'POST') {
    if (!doesUserExist(username, password)) {
      redirectLoginPage(res)
      return;
    }
  }

  if (req.method === 'POST') {
    const time = new Date();
    const sessionId = time.getTime();
    const session = { username, time, sessionId };
    req.sessions[sessionId] = session;
    res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
    redirectToGuestBook(res);
    return;
  }

  if (isSessionExist(req)) {
    redirectToGuestBook(res);
    return;
  }

  res.setHeader('content-type', 'text/html')
  res.end(loginForm);
  return
};

const logOutHandler = (req, res, next) => {
  const { pathname } = req;
  if (pathname !== '/logout') {
    next();
    return;
  }
  res.setHeader('Set-Cookie', `sessionId=0;Max-age=0`)
  redirectToGuestBook(res);
  res.end();
  return;
};

module.exports = { loginHandler, injectSession, injectCookies, logOutHandler };
