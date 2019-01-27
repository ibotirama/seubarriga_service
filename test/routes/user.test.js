const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'Water White', mail, password: '123456' })
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});

const MAIN_URL = '/users';

test('Shall list all users', () => {
  return request(app).get(MAIN_URL)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Shall insert an user with name Walter White.', () => {
  return request(app).post(MAIN_URL)
    .send({ name: 'Walter White', mail, password: 'anger' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Walter White');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Shall insert the user with password encrypted.', async () => {
  const res = await request(app).post(MAIN_URL)
    .send({ name: 'Walter White', mail: `${Date.now()}@mail.com`, password: '123456' })
    .set('authorization', `bearer ${user.token}`);

  expect(res.status).toBe(201);
  const { id } = res.body;
  const userDb = await app.services.user.findOne({ id });
  expect(userDb.password).not.toBeUndefined();
  expect(userDb.password).not.toBe('123456');
});

test('Shall not insert an user without name.', () => {
  return request(app).post(MAIN_URL)
    .send({ mail: 'mrwhite@mail.com', password: 'anger' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is required.');
    });
});

test('Shall not insert an user without email.', async () => {
  const result = await request(app).post(MAIN_URL)
    .send({ name: 'Walter White', password: 'anger' })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Mail is required.');
});

test('Shall not insert an user without password.', (done) => {
  request(app).post(MAIN_URL)
    .send({ name: 'Walter White', mail: 'mrwhite@mail.com' })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Password is required.');
      done();
    })
    .catch(err => done.fail(err));
});

test('Shall not insert a duplicated email.', () => {
  return request(app).post(MAIN_URL)
    .send({ name: 'Walter White', mail, password: 'anger' })
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('This email already exists in the database.');
    });
});
