
const createLogoutHandler = ({ sessions }) => {
  return (req, res, next) => {
    const { url } = req;
    if (url !== '/logout') {
      next();
      return;
    }

    const { sessionId } = req.cookies;
    delete sessions[sessionId];
    res.cookie('sessionId', 0, { 'Max-Age': 0 });
    res.redirect('/login');
    res.end();
    return;
  };
};

module.exports = { createLogoutHandler };
