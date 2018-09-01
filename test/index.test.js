const expect = require('chai').expect;
const request = require('supertest');

const makeServer = require('./factory');
const myRedis = require('../redis');
const { data, otherData } = require('./data');

const key = 'mykey';
const otherKey = 'myotherkey';
let server, zaddAsync, zrangeAsync, zrangebyscoreAsync, delAsync, zscanAsync;

describe('Route controllers test', () => {
  beforeEach(() => {
    server = makeServer();
    ({ 
      zaddAsync, zrangeAsync, zrangebyscoreAsync,
      delAsync, zscanAsync
    } = myRedis.getAsync());
  });

  beforeEach(async () => {
    await delAsync(key);
    await delAsync(otherKey);
    await Promise.all(data.map(entry => zaddAsync(key, entry.score, entry.member)));
    await Promise.all(otherData.map(entry => zaddAsync(otherKey, entry.score, entry.member)))
  })

  afterEach((done) => {
    server.close(() => {
      done();
    })
  })

  describe('Unknown route', () => {
    it('Should return error for unknown route', (done) => {
      request(server)
        .get('/random')
        .expect(404, done);
    })
  })

  describe('GET /object/key', () => {
    it('Should get the latest value of \'mykey\'', (done) => {
      request(server)
        .get(`/object/${key}`)
        .expect(200)
        .expect(res => {
          expect(res.body.value).to.eql({ name: 'han' })
        })
        .end(done)
    });

    it('Should get the latest value of \'myotherkey\'', (done) => {
      request(server)
        .get(`/object/${otherKey}`)
        .expect(200)
        .expect(res => {
          expect(res.body.value).to.equal(7)
        })
        .end(done)
    });

    it('Should return no result for key that does not exist', (done) => {
      request(server)
        .get('/object/randomkey')
        .expect(404, done)
    });

  })

  describe('GET /object/key?timestamp', () => {
    it('Should return result for the appropriate timestamp(11)', (done) => {
      request(server)
        .get(`/object/${key}?timestamp=11`)
        .expect(200)
        .expect(res => {
          expect(res.body.value).to.equal(2)
        })
        .end(done)
    });

    it('Should return result for the appropriate timestamp(230)', (done) => {
      request(server)
        .get(`/object/${key}?timestamp=230`)
        .expect(200)
        .expect(res => {
          expect(res.body.value).to.eql({ name: 'han' })
        })
        .end(done)
    });

    it('Should return no result for timestamp before results are added', (done) => {
      request(server)
        .get(`/object/${key}?timestamp=0`)
        .expect(404, done);
    })

    it('Should return no result for negative timestamp', (done) => {
      request(server)
        .get(`/object/${key}?timestamp=-20`)
        .expect(400, done);
    });

    it('Should return no result for timestamp that is not a number', (done) => {
      request(server)
        .get(`/object/${key}?timestamp=a2b3`)
        .expect(400, done);
    });
  });

  describe('POST /object no nesting', () => {
    it('Should add a string', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: 'awesome!' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value).to.equal('awesome!')
            })
            .end(done);
        })
    });

    it('Should add a number', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: 100 })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value).to.equal(100)
            })
            .end(done);
        })
    });

    it('Should add a boolean', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: true })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value).to.equal(true)
            })
            .end(done);
        })
    });

    it('Should not accept empty body', (done) => {
      request(server)
        .post('/object')
        .send({})
        .expect(400, done)
    });

    it('Should not accept null', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: null })
        .expect(400, done)
    });

    it('Should not accept object with more than 1 key', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: 'hi', other: 'bye' })
        .expect(400, done)
    });
  })

  describe('POST /object nested', () => {
    it('Should add a string', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: { feeling: 'awesome' } })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value.feeling).to.equal('awesome')
            })
            .end(done);
        })
    });

    it('Should add a number', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: { feeling: 100 } })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value.feeling).to.equal(100)
            })
            .end(done);
        })
    });

    it('Should add a boolean', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: { feeling: true } })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          request(server)
            .get('/object/mykey')
            .expect(200)
            .expect(res => {
              expect(res.body.value.feeling).to.equal(true)
            })
            .end(done);
        })
    });

    it('Should not accept null', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: { feeling: null } })
        .expect(400, done)
    });

    it('Should not accept object with more than 1 key', (done) => {
      request(server)
        .post('/object')
        .send({ mykey: { feeling: 'great', mood: 'greater' } })
        .expect(400, done)
    });

  });
})