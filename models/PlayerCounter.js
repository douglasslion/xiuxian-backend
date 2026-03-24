/**
 * 玩家ID计数器模型 - 用于生成连续的玩家ID
 */

const mongoose = require('mongoose');

const playerCounterSchema = new mongoose.Schema({
  counterName: {
    type: String,
    required: true,
    unique: true,
    default: 'playerId'
  },
  nextId: {
    type: Number,
    required: true,
    default: 861117 // 从861117开始
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const PlayerCounter = mongoose.model('PlayerCounter', playerCounterSchema);

module.exports = PlayerCounter;
