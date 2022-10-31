const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { RequestError } = require('../helpers');
const { authService } = require('../services');
const { getIdFromAuth } = require('../helpers');
const { saveToken, getUserById } = require('../services/authService');
const gravatar = require('gravatar');

const saltRounds = process.env.SALT_ROUNDS;
const secretJWT = process.env.SECRET_JWT;

const ctrlSingup = async (req, res) => {
  const { email, password } = req.body;

  const avatarURL = gravatar.url(email);
  const hashedPassword = await bcrypt.hash(password, +saltRounds);
  const { subscription } = await authService.saveUser({
    email,
    avatarURL,
    password: hashedPassword,
  });

  res.status(201).json({ user: { email, subscription, avatarURL } });
};

const ctrlLogin = async (req, res) => {
  const { email, password } = req.body;
  const [data] = await authService.getUserByEmail(email);

  if (data?.__id) {
    throw RequestError(401, 'Email or password is wrong');
  }

  const isPasswordCorrect = await bcrypt.compare(password, data.password);

  if (!isPasswordCorrect) {
    throw RequestError(401, 'Email or password is wrong');
  }

  const token = jwt.sign({ id: data.id }, secretJWT);

  const user = await authService.saveToken(data.id, token);

  res.json({ user, token });
};

const ctrlLogout = async (req, res) => {
  if (!req.headers?.authorization) {
    throw RequestError(401, 'Not authorized');
  }

  const id = getIdFromAuth(req.headers.authorization);

  const data = await saveToken(id, null);
  console.log(data);

  if (!data.email) {
    throw RequestError(401);
  }

  res.status(204).json();
};

const ctrlCurrent = async (req, res) => {
  if (!req.headers?.authorization) {
    throw RequestError(401, 'Not authorized');
  }

  const id = getIdFromAuth(req.headers.authorization);
  const { email, subscription } = await getUserById(id);

  if (!email) {
    throw RequestError(401, 'Not authorized');
  }

  res.status(200).json({ email, subscription });
};

module.exports = { ctrlSingup, ctrlLogin, ctrlLogout, ctrlCurrent };
