const { mongoose } = require('mongoose');
const { RequestError } = require('../../helpers');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  avatarURL: { type: String },
  token: {
    type: String,
    default: null,
  },
});

userSchema.post('save', (error, res, next) => {
  switch (error.code) {
    case 11000:
      throw RequestError(409, 'Email in use');

    default:
      break;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
