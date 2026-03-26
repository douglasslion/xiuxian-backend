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
      id: 'skill_1',
      name: '引气诀',
      rank: '凡阶',
      rankLevel: 1,
      description: '凡人入门，滋养肉身提health',
      obtainMethod: '商店，任务',
      attributes: {"health": 5}
    },
    {
      id: 'skill_2',
      name: '御风术',
      rank: '凡阶',
      rankLevel: 1,
      description: '借风提速，适合短途赶路',
      obtainMethod: '商店，任务',
      attributes: {"speed": 2}
    },
    {
      id: 'skill_3',
      name: '静心诀',
      rank: '凡阶',
      rankLevel: 1,
      description: '静心聚灵，避免走火入魔',
      obtainMethod: '商店，任务',
      attributes: {"mana": 5}
    },
    {
      id: 'skill_4',
      name: '纳运诀',
      rank: '凡阶',
      rankLevel: 1,
      description: '粗浅聚运，提升暴击概率',
      obtainMethod: '商店，任务',
      attributes: {"criticalRate": 0.005}
    },
    {
      id: 'skill_5',
      name: '灵葫锻体诀',
      rank: '灵阶',
      rankLevel: 2,
      description: '灵葫炼体，增幅health',
      obtainMethod: '商店，任务',
      attributes: {"health": 8}
    },
    {
      id: 'skill_6',
      name: '飞虹遁术',
      rank: '灵阶',
      rankLevel: 2,
      description: '化虹而行，速度远超御风',
      obtainMethod: '商店，任务',
      attributes: {"speed": 3}
    },
    {
      id: 'skill_7',
      name: '清心灵诀',
      rank: '灵阶',
      rankLevel: 2,
      description: '净化杂念，提升灵力纯度',
      obtainMethod: '商店，任务',
      attributes: {"mana": 8}
    },
    {
      id: 'skill_8',
      name: '鸿运诀',
      rank: '灵阶',
      rankLevel: 2,
      description: '引先天气运，增暴击',
      obtainMethod: '商店，任务',
      attributes: {"criticalRate": 0.008}
    },
    {
      id: 'skill_9',
      name: '玄黄炼体诀',
      rank: '黄阶',
      rankLevel: 3,
      description: '玄黄淬体，神魔立身之本',
      obtainMethod: '商店，任务',
      attributes: {"health": 12}
    },
    {
      id: 'skill_10',
      name: '裂空遁法',
      rank: '黄阶',
      rankLevel: 3,
      description: '裂空瞬移，快如惊雷',
      obtainMethod: '商店，任务',
      attributes: {"speed": 5}
    },
    {
      id: 'skill_11',
      name: '玄慧心经',
      rank: '黄阶',
      rankLevel: 3,
      description: '提升灵力，助力突破瓶颈',
      obtainMethod: '商店，任务',
      attributes: {"mana": 12}
    },
    {
      id: 'skill_12',
      name: '玄运天诀',
      rank: '黄阶',
      rankLevel: 3,
      description: '聚玄运气韵，避凶险',
      obtainMethod: '商店，任务',
      attributes: {"criticalRate": 0.01}
    },
    {
      id: 'skill_13',
      name: '地魁金身诀',
      rank: '玄阶',
      rankLevel: 4,
      description: '凝大地金身，硬抗准圣',
      obtainMethod: '商店，任务，宗门',
      attributes: {"health": 18}
    },
    {
      id: 'skill_14',
      name: '无影遁',
      rank: '玄阶',
      rankLevel: 4,
      description: '无影无踪，准圣难寻',
      obtainMethod: '商店，任务，宗门',
      attributes: {"speed": 7}
    },
    {
      id: 'skill_15',
      name: '地心灵慧经',
      rank: '玄阶',
      rankLevel: 4,
      description: '滋养神识，助破准圣',
      obtainMethod: '商店，任务，宗门',
      attributes: {"mana": 18}
    },
    {
      id: 'skill_16',
      name: '地煞鸿运经',
      rank: '玄阶',
      rankLevel: 4,
      description: '引地煞气运，牵天地机缘',
      obtainMethod: '商店，任务，宗门',
      attributes: {"criticalRate": 0.015}
    },
    {
      id: 'skill_17',
      name: '大品天仙诀·根骨篇',
      rank: '地阶',
      rankLevel: 5,
      description: '道门正统，淬炼先天根骨',
      obtainMethod: '商店，任务，宗门',
      attributes: {"constitution": 2}
    },
    {
      id: 'skill_18',
      name: '天罡遁法·迅捷篇',
      rank: '地阶',
      rankLevel: 5,
      description: '天罡淬身，提升迅捷',
      obtainMethod: '商店，任务，宗门',
      attributes: {"agility": 2}
    },
    {
      id: 'skill_19',
      name: '玉清仙法·悟性篇',
      rank: '地阶',
      rankLevel: 5,
      description: '玉清传承，提升悟性',
      obtainMethod: '商店，任务，宗门',
      attributes: {"wisdom": 2}
    },
    {
      id: 'skill_20',
      name: '天命大运诀·机缘篇',
      rank: '地阶',
      rankLevel: 5,
      description: '提升机缘，易获至宝',
      obtainMethod: '商店，任务，宗门',
      attributes: {"luck": 2}
    },
    {
      id: 'skill_21',
      name: '九转玄功·根骨经',
      rank: '天阶',
      rankLevel: 6,
      description: '九转淬骨，肉身成圣法门',
      obtainMethod: '商店，任务，宗门',
      attributes: {"constitution": 3}
    },
    {
      id: 'skill_22',
      name: '混沌极速法·迅捷经',
      rank: '天阶',
      rankLevel: 6,
      description: '混沌法则，速度破空间',
      obtainMethod: '商店，任务，宗门',
      attributes: {"agility": 3}
    },
    {
      id: 'skill_23',
      name: '九转元功·悟性经',
      rank: '天阶',
      rankLevel: 6,
      description: '九转悟道，速领大道',
      obtainMethod: '商店，任务，宗门',
      attributes: {"wisdom": 3}
    },
    {
      id: 'skill_24',
      name: '混元道经·机缘经',
      rank: '天阶',
      rankLevel: 6,
      description: '混元气运，引本源机缘',
      obtainMethod: '商店，任务，宗门',
      attributes: {"luck": 3}
    },
    {
      id: 'skill_25',
      name: '盘古真身诀·根骨天书',
      rank: '圣阶',
      rankLevel: 7,
      description: '盘古传承，根骨冠洪荒',
      obtainMethod: '活动',
      attributes: {"constitution": 5}
    },
    {
      id: 'skill_26',
      name: '鲲鹏北冥遁·迅捷天书',
      rank: '圣阶',
      rankLevel: 7,
      description: '鲲鹏传承，可混沌穿梭',
      obtainMethod: '活动',
      attributes: {"agility": 5}
    },
    {
      id: 'skill_27',
      name: '鸿蒙大道诀·悟性天书',
      rank: '圣阶',
      rankLevel: 7,
      description: '鸿蒙本源，悟性达混沌',
      obtainMethod: '活动',
      attributes: {"wisdom": 5}
    },
    {
      id: 'skill_28',
      name: '混沌本源诀·机缘天书',
      rank: '圣阶',
      rankLevel: 7,
      description: '混沌气运，引至宝机缘',
      obtainMethod: '活动',
      attributes: {"luck": 5}
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