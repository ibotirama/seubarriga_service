const ValidationError = require('../errors/ValidationError')

module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select(['id', 'name', 'mail']);
    }
        
    const save = async (user) => {
        if(!user.name) throw new ValidationError('Name is required.')
        if(!user.mail) throw new ValidationError('Mail is required.')
        if(!user.password) throw new ValidationError('Password is required.')

        const userDb = await findAll({ mail: user.mail })
        if(userDb && userDb.length > 0){
            throw new ValidationError('This email already exists in the database.')
        }

        return app.db('users').insert(user).returning(['id', 'name', 'mail'])
    }

    return { findAll, save }
}