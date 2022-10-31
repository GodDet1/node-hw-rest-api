const { User } = require('../db/contacts');

const saveUser = async body => {
  const contact = new User({ ...body });
  const data = await contact.save();
  return data;
};

const getUserByEmail = async email => await User.find({ email });
const getUserById = async id => await User.findById(id);

const saveToken = async (id, token) =>
  await User.findByIdAndUpdate(id, { token }).select('email subscription');

const setAvatar = async (id, avatarURL) => await User.findByIdAndUpdate(id, { avatarURL });
module.exports = { saveUser, getUserByEmail, saveToken, getUserById, setAvatar };
