/**
 * 功法模型
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true
  },
  skillId: {
    type: String,
    required: true
  },
  proficiency: {
    type: Number,
    default: 1,
    min: 1,
    max: 7
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

// 确保每个玩家对每个功法只有一条记录
skillSchema.index({ playerId: 1, skillId: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;