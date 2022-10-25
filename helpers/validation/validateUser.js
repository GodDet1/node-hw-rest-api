const Joi = require('joi');
const { assyncWrapper, RequestError } = require('../');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateUser = async (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw RequestError(400, error.message);
  }

  next();
};

module.exports = assyncWrapper(validateUser);
