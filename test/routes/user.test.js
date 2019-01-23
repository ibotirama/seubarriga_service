const request = require('supertest')
const app = require('../../src/app')

const mail = `${Date.now()}@mail.com`

test('Deve listar todos os usuários do sistema', () => {
    return request(app).get('/users')
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.length).toBeGreaterThan(0)
        })
})

test('Deve inserir um novo usuario com nome Walter White.', () => {
    return request(app).post('/users')
        .send({ name : 'Walter White', mail: mail, password: 'anger'})
        .then( (res) => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe('Walter White')
        })
})

test('Não deve inserir um usuario sem nome', () => {
    return request(app).post('/users')
        .send({ mail : 'mrwhite@mail.com', password: 'anger' })
        .then( res => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Nome é um atributo obrigatório.')
        })
})

test('Não deve inserir um usuario sem email.', async () => {
    const result = await request(app).post('/users')
        .send({ name : 'Walter White', password: 'anger' })
        
        expect(result.status).toBe(400)
        expect(result.body.error).toBe('Mail é um atributo obrigatório.')
})

test('Não deve inserir um usuario sem senha.', (done) => {
    request(app).post('/users')
        .send({ name : 'Walter White', mail: 'mrwhite@mail.com' })
        .then( result => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe('Password é um atributo obrigatório.')
            done()
        })
        .catch(err => done.fail(err))
        
})

test('Não deve inserir um usuario com email já existente.', () => {
    return request(app).post('/users')
        .send({ name : 'Walter White', mail: mail, password: 'anger' })
        .then( result => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe('Já existe um usuário com esse mail.')
        })        
})
