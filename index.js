const fs = require('fs');
const { createApp } = require('./src/app');

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

const app = createApp(config, fileOperation, userDetails);
app.listen(8181, () => { console.log('listening on http://localhost:8181'); });
