const request = require('supertest');
const app = require('../src/app.js');

test('Deve responder na url raiz', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});
