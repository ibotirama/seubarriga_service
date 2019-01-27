const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail']);
  };

  const findOne = (filter) => {
    return app.db('users').where(filter).first();
  };

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Name is required.');
    if (!user.mail) throw new ValidationError('Mail is required.');
    if (!user.password) throw new ValidationError('Password is required.');

    const userDb = await findOne({ mail: user.mail });
    if (userDb) {
      throw new ValidationError('This email already exists in the database.');
    }

    const newUser = { ...user };
    newUser.password = getPasswordHash(user.password);
    return app.db('users').insert(newUser).returning(['id', 'name', 'mail']);
  };

  return { findAll, save, findOne };
};
