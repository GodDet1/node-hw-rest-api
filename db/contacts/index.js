const connectMongo = require('./connect');
const Contact = require('./contactsModel');
const User = require('../user/userModel');

module.exports = { connectMongo, Contact, User };
