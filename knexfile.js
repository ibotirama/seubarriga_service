module.exports = {
    test: {
        client: 'pg',
        version: '9.6',
        connection: {
            host: 'localhost',
            user: 'seu_barriga',
            password: 'barrigapass',
            database: 'seu_barriga_db'
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
