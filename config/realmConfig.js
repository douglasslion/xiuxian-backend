/**
 * 境界配置
 */

// 境界配置
const realmConfig = {
  // 境界列表
  realms: [
    { name: '凡人', levels: 10, baseCap: 100, capMultiplier: 1.5 },
    { name: '后天', levels: 10, baseCap: 500, capMultiplier: 1.6 },
    { name: '先天', levels: 10, baseCap: 1000, capMultiplier: 1.7 },
    { name: '炼气', levels: 10, baseCap: 2000, capMultiplier: 1.8 },
    { name: '筑基', levels: 10, baseCap: 5000, capMultiplier: 1.9 },
    { name: '金丹', levels: 10, baseCap: 10000, capMultiplier: 2.0 },
    { name: '元婴', levels: 10, baseCap: 20000, capMultiplier: 2.1 },
    { name: '化神', levels: 10, baseCap: 50000, capMultiplier: 2.2 },
    { name: '炼虚', levels: 10, baseCap: 100000, capMultiplier: 2.3 },
    { name: '合体', levels: 10, baseCap: 200000, capMultiplier: 2.4 },
    { name: '大乘', levels: 10, baseCap: 500000, capMultiplier: 2.5 },
    { name: '地仙', levels: 10, baseCap: 1000000, capMultiplier: 2.6 },
    { name: '天仙', levels: 10, baseCap: 2000000, capMultiplier: 2.7 },
    { name: '真仙', levels: 10, baseCap: 5000000, capMultiplier: 2.8 },
    { name: '金仙', levels: 10, baseCap: 10000000, capMultiplier: 2.9 },
    { name: '太乙金仙', levels: 10, baseCap: 20000000, capMultiplier: 3.0 },
    { name: '大罗金仙', levels: 10, baseCap: 50000000, capMultiplier: 3.1 },
    { name: '准圣', levels: 10, baseCap: 100000000, capMultiplier: 3.2 },
    { name: '圣人', levels: 10, baseCap: 200000000, capMultiplier: 3.3 }
  ],
  
  // 突破失败概率配置（境界索引，从0开始）
  breakthroughFailureRate: {
    0: 0,      // 凡人
    1: 0,      // 后天
    2: 0,      // 先天
    3: 0,      // 炼气
    4: 0.1,    // 筑基
    5: 0.2,    // 金丹
    6: 0.3,    // 元婴
    7: 0.4,    // 化神
    8: 0.5,    // 炼虚
    9: 0.6,    // 合体
    10: 0.7,   // 大乘
    11: 0.75,  // 地仙
    12: 0.8,   // 天仙
    13: 0.85,  // 真仙
    14: 0.9,   // 金仙
    15: 0.92,  // 太乙金仙
    16: 0.95,  // 大罗金仙
    17: 0.98,  // 准圣
    18: 0.99   // 圣人
  },
  
  // 获取境界信息
  getRealmInfo(realmIndex) {
    return this.realms[realmIndex] || null;
  },
  
  // 计算指定境界和层次的修为上限
  calculateCap(realmIndex, level) {
    const realm = this.getRealmInfo(realmIndex);
    if (!realm) return 0;
    
    // 基础上限 * 倍数的(层次-1)次方
    return Math.floor(realm.baseCap * Math.pow(realm.capMultiplier, level - 1));
  },
  
  // 获取突破失败概率
  getBreakthroughFailureRate(realmIndex) {
    return this.breakthroughFailureRate[realmIndex] || 0;
  },
  
  // 获取下一个境界
  getNextRealm(realmIndex) {
    return this.realms[realmIndex + 1] || null;
  }
};

module.exports = realmConfig;