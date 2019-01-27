const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
const mail = `${Date.now()}@mail.com`;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'Water White', mail, password: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo!');
});


test('Must insert an account with success.', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    });
});

test('Must list all Accounts', () => {
  return app.db('accounts')
    .insert({ name: 'Acc #1', user_id: user.id })
    .then(() => {
      request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
});

test('Must return an account by Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc by Id', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe('Acc by Id');
          expect(res.body.user_id).toBe(user.id);
        });
    });
});

test('Must update an Account.', () => {
  return app.db('accounts')
    .insert({ name: 'Account to update', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: 'Account updated' })
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe('Account updated');
        });
    });
});

test('Must delete an Acount.', () => {
  return app.db('accounts')
    .insert({ name: 'Account to deleted', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(204);
        });
    });
});

test('Must not insert an account wihtout name.', () => {
  return request(app).post(`${MAIN_ROUTE}`)
    .send({ user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
    .catch((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório.');
    });
});

test.skip('Must not insert an account with an duplicate name for the same user.', () => {});
test.skip('Must only list accouts of the user logged.', () => {});
test.skip('Must not return an account of another user.', () => {});
test.skip('Must not udate an account of another user.', () => {});
test.skip('Must not delete an account of another user.', () => {});
