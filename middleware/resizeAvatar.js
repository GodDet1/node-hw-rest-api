const path = require('path');
const Jimp = require('jimp');
const { fsServise } = require('../services');

const oldPath = path.resolve('', process.env.OLD_AVATAR_PATH);
const newPath = path.resolve('', process.env.NEW_AVATAR_PATH);

const resizeAvatar = async (req, res, next) => {
  const avatarName = req.avatarName;

  const oldAvatar = `${oldPath}/${avatarName}`;
  const newAvatar = `${newPath}/${avatarName}`;

  await fsServise.replaceAvatar(oldAvatar, newAvatar);

  Jimp.read(newAvatar)
    .then(image => {
      return image.resize(250, 250).write(newAvatar);
    })
    .catch(err => {
      throw new Error(err);
    });

  next();
};

module.exports = resizeAvatar;
