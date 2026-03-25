/**
 * 跟脚配置
 */

// 跟脚配置
const rootConfig = {
  // 跟脚列表（包含概率）
  roots: [
    { name: '肉体凡胎', bonus: 0.15, probability: 0.05 },
    { name: '后天精怪', bonus: 0.45, probability: 0.15 },
    { name: '先天生灵', bonus: 0.75, probability: 0.35 },
    { name: '先天神魔', bonus: 1.05, probability: 0.25 },
    { name: '先天神圣', bonus: 1.55, probability: 0.15 },
    { name: '盘古后裔', bonus: 2.55, probability: 0.0499 },
    { name: '混沌本源', bonus: 5.55, probability: 0.0001 }
  ],
  
  // 随机获取一个跟脚（按照概率）
  getRandomRoot() {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const root of this.roots) {
      cumulativeProbability += root.probability;
      if (random <= cumulativeProbability) {
        return root;
      }
    }
    
    // 默认返回第一个跟脚
    return this.roots[0];
  },
  
  // 根据名称获取跟脚
  getRootByName(name) {
    return this.roots.find(root => root.name === name) || null;
  },
  
  // 获取所有跟脚
  getAllRoots() {
    return this.roots;
  }
};

module.exports = rootConfig;