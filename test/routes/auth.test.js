const request = require('supertest');
const app = require('../../src/app');

test('Must receive a token once logged.', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'Walter White', mail, password: '123456' })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ mail, password: '123456' })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('token');
        });
    });
});

test('Must not login using a wrong password.', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'Walter', mail, password: '123456' })
    .then(() => {
      request(app).post('/auth/signin')
        .send({ mail, password: '654321' })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('token');
        });
    });
});
