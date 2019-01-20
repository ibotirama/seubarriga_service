const app = require('express')()
const consign = require('consign')
const knex = require('knex')
const knexFile = require('../knexfile')
const knexLogger = require('knex-logger')

// TODO: Criar chaveamento dinamico 
app.db = knex(knexFile.test)
app.use(knexLogger(app.db))

consign({ cwd: 'src', verbose: true })
    .include('./config/middlewares.js')
    .then('./services')
    .then('./routes')
    .then('./config/routes.js')
    .into(app)

app.get('/', (req, res) =>{
    res.status(200).send()
})

module.exports = app