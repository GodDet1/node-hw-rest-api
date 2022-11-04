const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { RequestError } = require('../helpers');
const { authService } = require('../services');
const { getIdFromAuth } = require('../helpers');
const {
  saveToken,
  getUserByEmail,
  getUserById,
  setAvatar,
  userIdByVerificationToken,
  changeVerificationStatus,
} = require('../services/authService');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');
const transportMail = require('../helpers/emailConnect');
const verificationEmailTemplate = require('../helpers/emails/verificationEmail');

const { SALT_ROUNDS, SECRET_JWT } = process.env;

const ctrlSingup = async (req, res) => {
  const { email, password } = req.body;

  const avatarURL = gravatar.url(email);
  const hashedPassword = await bcrypt.hash(password, +SALT_ROUNDS);
  const verificationToken = uuidv4();
  const { subscription } = await authService.saveUser({
    email,
    avatarURL,
    password: hashedPassword,
    verificationToken,
  });

  const mail = verificationEmailTemplate(email, verificationToken);

  transportMail.sendMail(mail);

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

  const token = jwt.sign({ id: data.id }, SECRET_JWT);

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

const ctrlVerify = async (req, res) => {
  const token = req.params.verificationToken;

  const id = await userIdByVerificationToken(token);

  if (!id) {
    return res.status(404).json({ message: 'User not found' });
  }

  await changeVerificationStatus(id);

  return res.status(200).json({ message: 'Verification successful' });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Missing required field email' });
  }

  const [user] = await getUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'No user with this email' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }

  const mail = verificationEmailTemplate(email, user.verificationToken);

  transportMail.sendMail(mail);

  res.status(200).json({ message: 'Verification email sent' });
};

module.exports = {
  ctrlSingup,
  ctrlLogin,
  ctrlLogout,
  ctrlCurrent,
  ctrlAvatar,
  ctrlVerify,
  changeVerificationStatus,
  resendVerificationEmail,
};
