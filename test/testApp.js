const { createApp } = require('../src/app.js');
const request = require('supertest');
const fs = require('fs');
const assert = require('assert');
const home = fs.readFileSync('./public/index.html', 'utf-8');

const mockPersist = content => {
  return x => {
    content.push(x)
  };
};

describe('app', () => {
  let config = {};
  let fileOperation = {};
  let userDetails = {};
  let app;
  beforeEach(() => {
    config = {
      publicDir: './public',
      guestTemplate: '__COMMENTS__',
    };

    fileOperation = { read: x => x };
    userDetails = {
      sessions: {},
      users: {}
    }
  }
  )

  describe('path: /error ', () => {
    it('should send error for GET', (done) => {
      request(createApp(config, fileOperation, userDetails))
        .get('/error')
        .expect(404)
        .expect('content-length', '144', done)
    });
  });

  describe('path: / ', () => {
    it('should send home page for GET', (done) => {
      request(createApp(config, fileOperation, userDetails))
        .get('/')
        .expect(200)
        .expect('content-type', /html/)
        .expect(home, done)
    });
  });

  describe('path: /login', () => {
    it('should send login page for GET', (done) => {
      request(createApp(config, fileOperation, userDetails))
        .get('/login')
        .expect(200)
        .expect(/.*login/, done)
    });

    it('should redirect to /guest-book if session exist', (done) => {
      userDetails.sessions = { 123: { username: 'ab', time: 1, sessionId: 123 } };
      config.userFile = JSON.stringify({
        ab: { username: 'ab', password: 'ab' },
      });
      userDetails.users.ab = { username: 'ab', password: 'ab' };
      request(createApp(config, fileOperation, userDetails))
        .post('/login')
        .set('cookie', ['sessionId=123'])
        .expect('location', '/guest-book')
        .expect(302, done)
    });

    it('should redirect to /guest-book after user logged in', (done) => {
      userDetails.users = { ab: { username: 'ab', password: 'ab' } };
      request(createApp(config, fileOperation, userDetails))
        .post('/login')
        .send('username=ab&password=ab')
        .expect('redirect to /guest-book')
        .expect(200, done)
    });
  });

  describe('path: /guest-book', () => {
    it('should send login page for GET if session does not exist', (done) => {
      request(createApp(config, fileOperation, userDetails))
        .get('/guest-book')
        .expect(302)
        .expect('location', '/login.html', done)
    });

    it('should show guest-book for GET if user logged in', (done) => {
      userDetails.sessions = { 123: { username: 'ab', time: 1, sessionId: 123 } };
      config.userFile = JSON.stringify({
        ab: { username: 'ab', password: 'ab' },
      });
      config.guestFile = '[{"name":"ab","comment":"cool","date":"13","id":1}]';
      request(createApp(config, fileOperation, userDetails))
        .get('/guest-book')
        .set('cookie', ['sessionId=123'])
        .expect(/13.*ab.*cool/)
        .expect(200, done)
    });

  });

  describe('path: /guest-book', () => {
    it('should save comment for POST ', (done) => {
      const content = [];
      userDetails.sessions = { 123: { username: 'ab', time: 1, sessionId: 123 } };
      fileOperation.persist = mockPersist(content);

      const date = new Date().toLocaleString();
      const expectedContent = [JSON.stringify([{ name: "ab", comment: 'nice', date: `${date}`, id: 1 }])];
      request(createApp(config, fileOperation, userDetails))
        .post('/guest-book')
        .send('comment=nice')
        .set('cookie', ['sessionId=123'])
        .expect('comment added')
        .expect(200,)
        .end((err, res) => {
          done(err);
          assert.deepStrictEqual(content, expectedContent)
        })
    });
  });

  describe('path: /logout', () => {
    it('Should logout user and redirect to login page', (done) => {
      userDetails.sessions = { 123: { username: 'ab', time: 1, sessionId: 123 } };
      request(createApp(config, fileOperation, userDetails))
        .get('/logout')
        .set('cookie', ['sessionId=123'])
        .expect(302)
        .expect(/login/)
        .end((err, res) => {
          done(err);
          assert.deepStrictEqual(userDetails.sessions, {})
        })
    });
  });

  describe('path: /signup', () => {
    it('Should register new user', (done) => {
      const content = [];
      fileOperation.persist = mockPersist(content);
      request(createApp(config, fileOperation, userDetails))
        .post('/signup')
        .send('username=ab&password=ab')
        .end((err, res) => {
          assert.strictEqual(res.header.location, '/login.html');
          assert.strictEqual(res.statusCode, 302);
          request(createApp(config, fileOperation, userDetails))
            .post('/login')
            .send('username=ab&password=ab')
            .expect('redirect to /guest-book')
            .expect(200, done)
        })
    });
    it('Should not register new user if username is not available', (done) => {
      const content = [];
      fileOperation.persist = mockPersist(content);
      userDetails.users.ab = {
        username: 'ab',
        password: 'ab'
      }
      request(createApp(config, fileOperation, userDetails))
        .post('/signup')
        .send('username=ab&password=abc')
        .end((err, res) => {
          assert.strictEqual(res.text, 'conflict');
          assert.strictEqual(res.statusCode, 409);
          request(createApp(config, fileOperation, userDetails))
            .post('/login')
            .send('username=ab&password=abc')
            .set('cookie', ['sessionId=123'])
            .expect('invalid credential')
            .expect(401, done)
        })
    });
  });

  describe('path: /api', () => {
    it('should send api', (done) => {
      config.guestFile = '[{"name":"ab","comment":"cool","date":"13","id":1}]';
      request(createApp(config, fileOperation, userDetails))
        .get('/api')
        .send('username=ab&password=ab')
        .set('cookie', ['sessionId=123'])
        .expect('[{"name":"ab","comment":"cool","date":"13","id":1}]')
        .expect(200, done)
    });
  });
});
