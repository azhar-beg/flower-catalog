const { app } = require('../src/app.js');
const request = require('supertest');
const fs = require('fs');
const home = fs.readFileSync('./public/index.html', 'utf-8');

const mockWrite = content => {
  return x => content.push(x);
};

describe('path:/error for app', () => {
  it('should send error for GET /error', (done) => {
    const config = {};
    request(app(config))
      .get('/error')
      .expect(404)
      .expect('content-length', '37')
      .expect('<html><body>Bad Request</body></html>', done)
  });
});

describe('app', () => {
  it('should send home page for GET /', (done) => {
    const config = {};
    request(app(config))
      .get('/')
      .expect(200)
      .expect('content-type', /html/)
      .expect(home, done)
  });

  it('should send login page for GET /login', (done) => {
    const config = {
      sessions: {},
      users: {}
    }
    request(app(config))
      .get('/login')
      .expect(302)
      .expect('location', '/login.html')
      .expect('redirected to /login.html', done)
  });

  it('should send login page for GET /guest-book if session does not exist', (done) => {
    const config = {
      sessions: {},
      users: {}
    }
    request(app(config))
      .get('/login')
      .expect(302)
      .expect('location', '/login.html')
      .expect('redirected to /login.html', done)
  });

  it('should redirect to /guest-book for  /login if session exist', (done) => {
    const config = {
      sessions: { 123: { username: 'ab', time: 1, sessionI: 123 } },
      users: {
        ab: { username: 'ab', password: 'ab' },
      },
    }
    request(app(config))
      .post('/login')
      .set('cookie', ['sessionId=123'])
      .expect('redirected to /guest-book')
      .expect('location', '/guest-book')
      .expect(302, done)
  });

  it('should show guest-book for GET /guest-book if user logged in', (done) => {
    const config = {
      sessions: { 123: { username: 'ab', time: 1, sessionI: 123 } },
      users: {
        ab: { username: 'ab', password: 'ab' },
      },
      comments: '[{"name":"ab","comment":"cool","date":"13","id":1}]',
      publicDir: './public',
      guestTemp: '__COMMENTS__',
      read: x => x
    }

    const expectedHtml = '<div id=1 class="comment"><div id= class="date">13</div><div id= class="name">ab</div><div id= class="message">cool</div></div>'
    request(app(config))
      .get('/guest-book')
      .set('cookie', ['sessionId=123'])
      .expect(expectedHtml)
      .expect(200, done)
  });
});