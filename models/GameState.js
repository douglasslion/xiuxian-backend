/**
 * 游戏状态模型
 */

const mongoose = require('mongoose');

const gameStateSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: false // 保留userId字段用于向后兼容
  },
  state: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastSaveTime: {
    type: Date,
    default: Date.now
  }
});

const GameState = mongoose.model('GameState', gameStateSchema);

module.exports = GameState;
