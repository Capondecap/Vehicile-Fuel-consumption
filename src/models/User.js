const db = require('../config/db');

let nextId = 1;

const UserModel = {
  findByUsername(username) {
    return db.users.find((u) => u.username === username) || null;
  },

  findById(id) {
    return db.users.find((u) => u.id === id) || null;
  },

  create({ username, password }) {
    const user = { id: nextId++, username, password };
    db.users.push(user);
    return user;
  },
};

module.exports = UserModel;
