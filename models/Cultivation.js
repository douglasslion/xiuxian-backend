/**
 * 修炼状态模型
 */

const mongoose = require('mongoose');

const cultivationSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  isCultivating: {
    type: Boolean,
    default: false
  },
  efficiency: {
    type: Number,
    default: 1.0
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
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

const Cultivation = mongoose.model('Cultivation', cultivationSchema);

module.exports = Cultivation;