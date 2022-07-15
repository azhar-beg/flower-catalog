const createSignupHandler = ({ users }, { userFile }, { persist }) => {
  return (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
      res.status(409);
      res.end('conflict');
      return;
    }

    users[username] = { username, password };
    persist(JSON.stringify(users), userFile);
    res.redirect('/login.html');
    return;
  }
};

module.exports = { createSignupHandler };
