const request = require('supertest')
const app = require('../../src/app')

const mail = `${Date.now()}@mail.com`

test('Shall list all users', () => {
    return request(app).get('/users')
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.length).toBeGreaterThan(0)
        })
})

test('Shall insert an user with name Walter White.', () => {
    return request(app).post('/users')
        .send({ name : 'Walter White', mail: mail, password: 'anger'})
        .then( (res) => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe('Walter White')
            expect(res.body).not.toHaveProperty('password')
        })
})

test('Shall insert the user with password encrypted.', () => {
    
})

test('Shall not insert an user without name.', () => {
    return request(app).post('/users')
        .send({ mail : 'mrwhite@mail.com', password: 'anger' })
        .then( res => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Name is required.')
        })
})

test('Shall not insert an user without email.', async () => {
    const result = await request(app).post('/users')
        .send({ name : 'Walter White', password: 'anger' })
        
        expect(result.status).toBe(400)
        expect(result.body.error).toBe('Mail is required.')
})

test('Shall not insert an user without password.', (done) => {
    request(app).post('/users')
        .send({ name : 'Walter White', mail: 'mrwhite@mail.com' })
        .then( result => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe('Password is required.')
            done()
        })
        .catch(err => done.fail(err))
        
})

test('Shall not insert a duplicated email.', () => {
    return request(app).post('/users')
        .send({ name : 'Walter White', mail: mail, password: 'anger' })
        .then( result => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe('This email already exists in the database.')
        })        
})
