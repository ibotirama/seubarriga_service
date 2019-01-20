module.exports = {
    test: {
        client: 'pg',
        version: '9.6',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            database: 'barriga'
        },
        debug: true,
        pool: {
            min: 0,
            max: 20,
            afterCreate: (conn, done) => { done() }
        },
        migrations: {
            directory: 'src/migrations'
        }
    }
}
