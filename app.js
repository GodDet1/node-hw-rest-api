const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const contactsRouter = require('./routes/api/contacts');
const signup = require('./routes/signup');
const path = require('path');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/users', signup);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  return res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;

  return res.status(status).json({ message });
});

module.exports = app;
