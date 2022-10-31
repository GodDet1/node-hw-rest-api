const fs = require('fs/promises');

const replaceAvatar = async (oldPath, newPath) => {
  await fs.rename(oldPath, newPath);
};

module.exports = { replaceAvatar };
