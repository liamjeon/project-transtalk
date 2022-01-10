const express = require("express");
const { User } = require("../../models/models");

class UserRepository {
  async create(username, snsId, auth, provider, approve) {
    return User.create({ username, snsId, auth, provider, approve });
  }

  async updateAuth(snsId, auth) {
    return User.findOne({ where: { snsId } }).then((user) => {
      user.auth = auth;
      return user.save();
    });
  }

  async getByKakaoId(id) {
    return User.findOne({ where: { snsId: id } });
  }
}

module.exports = UserRepository;
