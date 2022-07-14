const http = require('http');
const { app } = require('./src/app.js');
const fs = require('fs');

const userDetails = {
  sessions: {},
  users: JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
}

const fileOperation = {
  persist: (content, file) => { fs.writeFileSync(file, content, 'utf8'); },
  read: file => fs.readFileSync(file, 'utf-8'),
}
const config = {
  userFile: './data/users.json',
  guestFile: './data/comments.json',
  publicDir: './public',
  guestTemplate: './templates/guest-book.html',
}

const startServer = (PORT, app) => {
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(8181, app(config, fileOperation, userDetails));
