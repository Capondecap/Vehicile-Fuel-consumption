const UserModel = require('../models/User');

const userService = {
  async findByUsername(username) {
    return UserModel.findByUsername(username);
  },

  async verifyPassword(plaintext, stored) {
    return plaintext === stored;
  },
};

module.exports = userService;
