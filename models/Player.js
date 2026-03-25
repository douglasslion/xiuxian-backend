/**
 * 玩家模型 - 用于管理玩家ID分配
 */

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: '修仙者'
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
