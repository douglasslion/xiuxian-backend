/**
 * 装备模型
 */

const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weapon', 'clothes', 'belt', 'shoes', 'necklace', 'ring', 'jade', 'artifact']
  },
  name: {
    type: String,
    required: true
  },
  quality: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  level: {
    type: Number,
    default: 0
  },
  attributes: {
    type: Object,
    default: {}
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

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;