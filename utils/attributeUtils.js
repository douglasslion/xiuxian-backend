/**
 * 属性工具函数
 */

/**
 * 随机分配初始属性点
 * @param {number} totalPoints - 总属性点
 * @param {number} minPerAttr - 每个属性的最小值
 * @param {number} maxPerAttr - 每个属性的最大值
 * @param {number} attrCount - 属性数量
 * @returns {Object} 分配后的属性
 */
exports.randomDistributeAttributes = (totalPoints = 20, minPerAttr = 1, maxPerAttr = 8, attrCount = 4) => {
  const attributes = {
    constitution: minPerAttr,
    agility: minPerAttr,
    luck: minPerAttr,
    wisdom: minPerAttr
  };
  
  let remainingPoints = totalPoints - (minPerAttr * attrCount);
  const attrKeys = Object.keys(attributes);
  
  while (remainingPoints > 0) {
    const randomAttr = attrKeys[Math.floor(Math.random() * attrKeys.length)];
    if (attributes[randomAttr] < maxPerAttr) {
      attributes[randomAttr]++;
      remainingPoints--;
    }
  }
  
  return attributes;
};