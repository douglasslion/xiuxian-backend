/**
 * 游戏配置模型
 */

const mongoose = require('mongoose');

const gameConfigSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true
  },
  realms: {
    type: Array,
    default: []
  },
  skills: {
    type: Array,
    default: []
  },
  equipment: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const GameConfig = mongoose.model('GameConfig', gameConfigSchema);

module.exports = GameConfig;
