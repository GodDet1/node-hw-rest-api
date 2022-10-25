const jwt = require('jsonwebtoken');

const getIdFromAuth = authInfo => {
  // eslint-disable-next-line no-unused-vars
  const [type, token] = authInfo.split(' ');

  const { id } = jwt.verify(token, process.env.SECRET_JWT);

  return id;
};

module.exports = getIdFromAuth;
