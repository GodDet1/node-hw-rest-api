const { RequestError } = require('../helpers');
const { getUserById } = require('../services/authService');
const { getIdFromAuth } = require('../helpers');

const authCtrl = async (req, res, next) => {
  if (!req.headers?.authorization) {
    throw RequestError(401, 'Not authorized');
  }

  const id = getIdFromAuth(req.headers.authorization);
  const user = await getUserById(id);

  if (!user.token) {
    throw RequestError(401, 'Not authorized');
  }

  if (user.id !== id) {
    throw RequestError(401, 'Not authorized');
  }

  req.user = user;

  next();
};

module.exports = authCtrl;
