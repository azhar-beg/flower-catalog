const injectSession = ({ sessions }) => {
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
  const { users, body } = req;
  const { username, password } = body;
  if (!doesUserExist(users, username, password)) {
    res.status(401);
    res.end('invalid credential');
    return;
  }

  const sessions = req.sessions;
  const time = new Date();
  const sessionId = time.getTime();
  const session = { username, time, sessionId };
  sessions[sessionId] = session;
  res.cookie('sessionId', sessionId);
  res.end('redirect to /guest-book');
  return;
}

const createLoginHandler = ({ sessions, users }) => {
  return (req, res) => {
    if (req.session) {
      res.redirect('/guest-book');
      return;
    }
    req.users = users;
    req.sessions = sessions;
    sessionsHandler(req, res);
  };
};

module.exports = { createLoginHandler, injectSession };
