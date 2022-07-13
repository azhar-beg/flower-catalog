const http = require('http');
const { app } = require('./src/app.js');
const fs = require('fs');

const config = {
  sessions: {},
  users: {
    azhar: { username: 'azhar', password: 'azhar' },
    rishabh: { username: 'rishabh', password: 'rishabh' },
  },
  comments: './data/comments.json',
  publicDir: './public',
  guestTemp: './templates/guest-book.html',
  persist: (content, file) => { fs.writeFileSync(file, content, 'utf8'); },
  read: file => fs.readFileSync(file, 'utf-8'),
}

const startServer = (PORT, app) => {
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
};

startServer(8181, app(config));
