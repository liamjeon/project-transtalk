const express = require("express");
const { User } = require("../../models/models");

class UserRepository {
  async create(username, snsId, auth, provider, approve) {
    return User.create({ username, snsId, auth, provider, approve });
  }

  async getByKakaoId(id) {
    return User.findOne({ where: { snsId: id } });
  }
}

module.exports = UserRepository;
