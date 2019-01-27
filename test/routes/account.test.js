const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User account', mail: `${Date.now()}@mail.com`, password: '1234' });
  user = { ...res[0] };
});

test('Deve inserir uma conta com sucesso.', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', user_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    });
});

test('Deve listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'Acc #1', user_id: user.id })
    .then(() => {
      request(app).get(MAIN_ROUTE)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
});

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc by Id', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe('Acc by Id');
          expect(res.body.user_id).toBe(user.id);
        });
    });
});

test('Deve alterar uma conta.', () => {
  return app.db('accounts')
    .insert({ name: 'Account to update', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({ name: 'Account updated' })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe('Account updated');
        });
    });
});

test('Deve apagar uma conta.', () => {
  return app.db('accounts')
    .insert({ name: 'Account to deleted', user_id: user.id }, ['id'])
    .then((acc) => {
      request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .then((res) => {
          expect(res.status).toBe(204);
        });
    });
});

test('Não deve inserir conta sem nome', () => {
  return request(app).post(`${MAIN_ROUTE}`)
    .send({ user_id: user.id })
    .catch((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório.');
    });
});

test.skip('Não deve inserir uma conta com nome duplicado para o mesmo usuario.', () => {});
test.skip('Deve listar apenas as contas do usuario.', () => {});
test.skip('Não deve retornar uma conta de outro usuario.', () => {});
test.skip('Não deve alterar uma conta de outro usuario.', () => {});
test.skip('Não deve remover uma conta de outro usuario.', () => {});
