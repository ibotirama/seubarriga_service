const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationErrror = require('../errors/ValidationError')

// FIXME: Move it to a file that it's in .gitignore
const secret = 'Segredo!';

module.exports = (app) => {
  const signin = (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new ValidationErrror('User or password invalida.')
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json(token);
        } else throw new ValidationErrror('User or password invalid.');
      })
      .catch((err) => { next(err); });
  };

  return { signin };
};
