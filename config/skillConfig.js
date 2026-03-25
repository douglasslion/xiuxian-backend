/**
 * 功法配置
 */

// 功法配置
const skillConfig = {
  // 功法品阶
  ranks: [
    { name: '凡阶', multiplier: 1 },
    { name: '灵阶', multiplier: 2 },
    { name: '黄阶', multiplier: 3 },
    { name: '玄阶', multiplier: 4 },
    { name: '地阶', multiplier: 5 },
    { name: '天阶', multiplier: 6 },
    { name: '圣阶', multiplier: 7 }
  ],
  
  // 熟练度等级
  proficiencyLevels: [
    { level: 1, name: '入门', multiplier: 1 },
    { level: 2, name: '生疏', multiplier: 3 },
    { level: 3, name: '熟练', multiplier: 4 },
    { level: 4, name: '精通', multiplier: 5 },
    { level: 5, name: '小成', multiplier: 6 },
    { level: 6, name: '大成', multiplier: 7 },
    { level: 7, name: '圆满', multiplier: 9 }
  ],
  
  // 功法列表
  skills: [
    {
      id: 'skill_001',
      name: '基础拳法',
      rank: '凡阶',
      rankLevel: 1,
      description: '最基础的拳法，适合初学者练习',
      obtainMethod: '初始功法',
      attributes: {
        attack: 5,
        defense: 2
      }
    },
    {
      id: 'skill_002',
      name: '清风剑法',
      rank: '灵阶',
      rankLevel: 2,
      description: '轻盈灵动的剑法，速度快',
      obtainMethod: '新手村任务',
      attributes: {
        attack: 8,
        speed: 5
      }
    },
    {
      id: 'skill_003',
      name: '金钟罩',
      rank: '黄阶',
      rankLevel: 3,
      description: '提升防御力的功法',
      obtainMethod: '帮派贡献兑换',
      attributes: {
        defense: 10,
        health: 20
      }
    },
    {
      id: 'skill_004',
      name: '御气飞行',
      rank: '玄阶',
      rankLevel: 4,
      description: '能够御气飞行的高级功法',
      obtainMethod: '秘境探索',
      attributes: {
        speed: 15,
        spirit: 10
      }
    },
    {
      id: 'skill_005',
      name: '九阴真经',
      rank: '地阶',
      rankLevel: 5,
      description: '强大的内功心法',
      obtainMethod: '副本掉落',
      attributes: {
        attack: 20,
        health: 30,
        mana: 25
      }
    },
    {
      id: 'skill_006',
      name: '九阳神功',
      rank: '天阶',
      rankLevel: 6,
      description: '至阳至刚的神功',
      obtainMethod: '世界boss掉落',
      attributes: {
        attack: 30,
        defense: 20,
        health: 40
      }
    },
    {
      id: 'skill_007',
      name: '混沌决',
      rank: '圣阶',
      rankLevel: 7,
      description: '传说中的混沌功法',
      obtainMethod: '活动获取',
      attributes: {
        attack: 50,
        defense: 30,
        health: 60,
        mana: 50,
        speed: 20
      }
    }
  ],
  
  // 根据ID获取功法
  getSkillById(id) {
    return this.skills.find(skill => skill.id === id) || null;
  },
  
  // 根据品阶获取功法
  getSkillsByRank(rank) {
    return this.skills.filter(skill => skill.rank === rank);
  },
  
  // 获取所有功法
  getAllSkills() {
    return this.skills;
  },
  
  // 获取熟练度信息
  getProficiencyInfo(level) {
    return this.proficiencyLevels.find(levelInfo => levelInfo.level === level) || null;
  },
  
  // 获取品阶信息
  getRankInfo(rank) {
    return this.ranks.find(rankInfo => rankInfo.name === rank) || null;
  }
};

module.exports = skillConfig;