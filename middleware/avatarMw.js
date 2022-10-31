const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const IMAGE_PATH = path.resolve('tmp');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, IMAGE_PATH);
  },
  filename: (req, files, callback) => {
    const [, extencion] = files.originalname.split('.');
    const avatarName = `${uuidv4()}.${extencion}`;

    req.avatarName = avatarName;

    callback(null, avatarName);
  },
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;
