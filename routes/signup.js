const express = require('express');
const router = express.Router();

const {
  userControllers: { ctrlSingup, ctrlLogin, ctrlLogout, ctrlCurrent, ctrlAvatar },
} = require('../controllers');

const { assyncWrapper } = require('../helpers');
const validateUser = require('../helpers/validation/validateUser');
const authCtrl = require('../middleware/authMW');
const avatarMiddleware = require('../middleware/avatarMw');
const resizeAvatar = require('../middleware/resizeAvatar');

router.post('/signup', validateUser, assyncWrapper(ctrlSingup));
router.post('/login', validateUser, assyncWrapper(ctrlLogin));
router.patch(
  '/avatars',
  [assyncWrapper(authCtrl), avatarMiddleware.single('avatar'), resizeAvatar],
  assyncWrapper(ctrlAvatar)
);
router.get('/logout', assyncWrapper(ctrlLogout));
router.get('/current', assyncWrapper(ctrlCurrent));

module.exports = router;
