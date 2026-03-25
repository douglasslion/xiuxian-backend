/**
 * 跟脚配置
 */

// 跟脚配置
const rootConfig = {
  // 跟脚列表
  roots: [
    { name: '肉体凡胎', bonus: 0.15 },
    { name: '后天精怪', bonus: 0.45 },
    { name: '先天生灵', bonus: 0.75 },
    { name: '先天神魔', bonus: 1.05 },
    { name: '先天神圣', bonus: 1.55 },
    { name: '盘古后裔', bonus: 2.55 },
    { name: '混沌本源', bonus: 5.55 }
  ],
  
  // 随机获取一个跟脚
  getRandomRoot() {
    const randomIndex = Math.floor(Math.random() * this.roots.length);
    return this.roots[randomIndex];
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