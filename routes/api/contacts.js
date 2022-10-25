const express = require('express');
const { assyncWrapper } = require('../../helpers');

const {
  contactsControllers: {
    getContactByIdController,
    getContactsListController,
    addContactController,
    removeContactController,
    updateContactController,
    updateStatusContactController,
  },
} = require('../../controllers');
const { validateContacts } = require('../../helpers/validation');
const authCtrl = require('../../middleware/authMW');

const router = express.Router();

router.use(assyncWrapper(authCtrl));

router.get('/', assyncWrapper(getContactsListController));
router.get('/:contactId', assyncWrapper(getContactByIdController));
router.post('/', validateContacts, assyncWrapper(addContactController));
router.delete('/:contactId', assyncWrapper(removeContactController));
router.put('/:contactId', validateContacts, assyncWrapper(updateContactController));
router.patch('/:contactId/favorite', assyncWrapper(updateStatusContactController));

module.exports = router;
