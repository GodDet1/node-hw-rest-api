const { EMAIL } = process.env;

const verificationEmailTemplate = (email, verificationToken) => ({
  to: email,
  from: EMAIL,
  subject: 'Accept registartion',
  html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Нажмите для подтверждения регистрации</a>`,
});

module.exports = verificationEmailTemplate;
