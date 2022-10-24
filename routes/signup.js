const express = require('express');
const router = express.Router();

const {
  userControllers: { ctrlSingup, ctrlLogin, ctrlLogout, ctrlCurrent },
} = require('../controllers');

const { assyncWrapper } = require('../helpers');
const validateUser = require('../helpers/validation/validateUser');

router.post('/signup', validateUser, assyncWrapper(ctrlSingup));
router.post('/login', validateUser, assyncWrapper(ctrlLogin));
router.get('/logout', assyncWrapper(ctrlLogout));
router.get('/current', assyncWrapper(ctrlCurrent));

module.exports = router;
