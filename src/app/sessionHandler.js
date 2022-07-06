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
    <input type="submit" value="Login">
  </form>
</body>

</html>`

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

const isSessionExist = (req) => {
  const { sessions, cookies } = req;
  const { sessionId } = cookies;
  return sessionId && sessions[sessionId];
};

const loginHandler = (req, res, next) => {
  const { pathname } = req;
  if (pathname !== '/login') {
    next();
    return;
  }

  const { username } = req.params;
  if (req.method === 'POST' && username) {
    const time = new Date();
    const sessionId = time.getTime();
    const session = { username, time, sessionId };
    req.sessions[sessionId] = session;
    res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
  }

  if (isSessionExist(req)) {
    res.statusCode = 302;
    res.setHeader('location', '/guest-book');
    res.end()
    return;
  }

  res.setHeader('content-type', 'text/html')
  res.end(loginForm);
  return
};

module.exports = { loginHandler, injectSession, injectCookies };
