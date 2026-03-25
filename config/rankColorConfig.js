/**
 * 品阶颜色配置
 */

const rankColorConfig = {
  // 7个品阶等级对应的颜色
  levels: [
    { level: 1, color: '#999999' }, // 灰色
    { level: 2, color: '#00FF00' }, // 绿色
    { level: 3, color: '#0066FF' }, // 蓝色
    { level: 4, color: '#9933FF' }, // 紫色
    { level: 5, color: '#FF9900' }, // 橙色
    { level: 6, color: '#FF0000' }, // 红色
    { level: 7, color: '#FFD700' }  // 金色
  ],
  
  // 根据等级获取颜色
  getColorByLevel(level) {
    const rank = this.levels.find(l => l.level === level);
    return rank ? rank.color : '#999999';
  },
  
  // 获取所有等级配置
  getAllLevels() {
    return this.levels;
  }
};

module.exports = rankColorConfig;