/**
 * 境界模型
 */

const mongoose = require('mongoose');

const realmSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  realmName: {
    type: String,
    required: true
  },
  realmIndex: {
    type: Number,
    required: true,
    min: 0
  },
  realmLevel: {
    type: Number,
    required: true,
    min: 1
  },
  cultivationProgress: {
    type: Number,
    default: 0
  },
  cultivationCap: {
    type: Number,
    required: true,
    min: 1
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

// 计算修为进度百分比
realmSchema.virtual('progressPercentage').get(function() {
  return Math.min(Math.round((this.cultivationProgress / this.cultivationCap) * 100), 100);
});

// 确保虚拟属性被序列化
realmSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

const Realm = mongoose.model('Realm', realmSchema);

module.exports = Realm;