const nodemailer = require('nodemailer');
require('dotenv').config();

const { EMAIL, EMAIL_PASSWORD } = process.env;

const nodemailerconfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerconfig);

module.exports = transport;
