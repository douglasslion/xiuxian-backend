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
  baseCultivation: {
    type: Number,
    default: 10
  },
  rootBonus: {
    type: Number,
    default: 1.0
  },
  skillBonus: {
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

// 计算实时修炼效率
cultivationSchema.virtual('realTimeEfficiency').get(function() {
  return this.baseCultivation * (this.rootBonus + this.skillBonus);
});

// 确保虚拟属性被序列化
cultivationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

const Cultivation = mongoose.model('Cultivation', cultivationSchema);

module.exports = Cultivation;