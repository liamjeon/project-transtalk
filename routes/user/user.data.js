const express = require("express");
const { User } = require("../../models/models");

class UserRepository {
  async create(username, userKey, auth) {
    return User.create({ username, userKey, auth });
  }
}

module.exports = UserRepository;
