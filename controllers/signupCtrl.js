const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { RequestError } = require('../helpers');
const { authService } = require('../services');
const { getIdFromAuth } = require('../helpers');
const { saveToken, getUserById, setAvatar } = require('../services/authService');
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

  return res.status(201).json({ user: { email, subscription, avatarURL } });
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

  return res.json({ user, token });
};

const ctrlLogout = async (req, res) => {
  if (!req.headers?.authorization) {
    throw RequestError(401, 'Not authorized');
  }

  const id = getIdFromAuth(req.headers.authorization);

  const data = await saveToken(id, null);

  if (!data.email) {
    throw RequestError(401);
  }

  return res.status(204).json();
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

  return res.status(200).json({ email, subscription });
};

const ctrlAvatar = async (req, res) => {
  const avatarName = req.avatarName;

  const avatarURL = `${process.env.AVATAR_BASIC_URL}/${avatarName}`;

  const id = getIdFromAuth(req.headers.authorization);

  await setAvatar(id, avatarURL);
  return res.json({ avatarURL });
};

module.exports = { ctrlSingup, ctrlLogin, ctrlLogout, ctrlCurrent, ctrlAvatar };
