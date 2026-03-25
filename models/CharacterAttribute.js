/**
 * 角色属性模型
 */

const mongoose = require('mongoose');

const characterAttributeSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  // 基础属性
  constitution: {
    type: Number,
    default: 0
  },
  agility: {
    type: Number,
    default: 0
  },
  luck: {
    type: Number,
    default: 0
  },
  wisdom: {
    type: Number,
    default: 0
  },
  // 自由属性点
  freePoints: {
    type: Number,
    default: 20
  },
  // 跟脚
  root: {
    type: String,
    default: '肉体凡胎'
  },
  rootBonus: {
    type: Number,
    default: 0.15
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

// 计算衍生属性
characterAttributeSchema.virtual('derivedAttributes').get(function() {
  const bonus = 1 + this.rootBonus;
  return {
    health: Math.floor(this.constitution * 10 * bonus),
    mana: Math.floor(this.wisdom * 5 * bonus),
    spirit: Math.floor(this.wisdom * 4 * bonus),
    attack: Math.floor(this.constitution * 3 * bonus),
    defense: Math.floor(this.constitution * 2 * bonus),
    speed: this.agility * 1.5 * bonus,
    dodge: this.agility * 0.8 * bonus,
    criticalRate: this.luck * 0.5 * bonus
  };
});

const CharacterAttribute = mongoose.model('CharacterAttribute', characterAttributeSchema);

module.exports = CharacterAttribute;