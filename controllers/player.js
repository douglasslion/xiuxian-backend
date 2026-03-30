/**
 * 玩家控制器 - 处理玩家ID分配和游戏状态管理
 */

const path = require('path');
const Player = require('../models/Player');
const PlayerCounter = require('../models/PlayerCounter');
const GameState = require('../models/GameState');
const Equipment = require('../models/Equipment');
const Cultivation = require('../models/Cultivation');
const Realm = require('../models/Realm');
const CharacterAttribute = require('../models/CharacterAttribute');
const Skill = require('../models/Skill');
const realmConfig = require('../config/realmConfig');
const rootConfig = require('../config/rootConfig');
const skillConfig = require('../config/skillConfig');
const rankColorConfig = require('../config/rankColorConfig');
const { randomDistributeAttributes } = require('../utils/attributeUtils');

/**
 * 获取新玩家ID
 */
exports.getNewPlayerId = async (req, res) => {
  try {
    console.log('=== 获取新玩家ID请求开始 ===');

    // 使用原子操作获取并递增计数器
    const counter = await PlayerCounter.findOneAndUpdate(
      { counterName: 'playerId' },
      { $inc: { nextId: 1 }, $set: { updatedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('计数器查询结果:', counter);

    // 如果是刚创建的计数器,使用初始值(861117)
    const newId = counter.nextId - 1; // 因为已经递增了,所以减1

    console.log('分配新玩家ID:', newId);

    const response = {
      status: 'success',
      data: {
        playerId: newId.toString()
      }
    };

    console.log('返回的响应:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('获取新玩家ID失败:', error);
    res.status(500).json({ status: 'error', message: '获取新玩家ID失败' });
  }
};

/**
 * 获取玩家游戏状态
 */
exports.getPlayerState = async (req, res) => {
  try {
    const { playerId: rawPlayerId } = req.params;

    if (!rawPlayerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 检查并创建玩家记录
    let player = await Player.findOne({ playerId });
    if (!player) {
      player = new Player({
        playerId,
        name: '修仙者',
        avatar: '/avatars/nan_shaolinsi.png',
        lastLoginAt: new Date()
      });
      await player.save();
    }

    // 检查并创建游戏状态
    let gameState = await GameState.findOne({ playerId });
    if (!gameState) {
      const defaultState = {
        energy: 0,
        fairyCrystal: 0,
        spiritStone: 0,
        isCultivating: false
      };
      
      gameState = new GameState({
        playerId,
        state: defaultState,
        lastSaveTime: new Date()
      });
      await gameState.save();
    }

    // 检查并创建修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      cultivation = new Cultivation({
        playerId,
        isCultivating: false,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1.0,
        skillBonus: 1.0,
        expInterval: 30
      });
      await cultivation.save();
    }

    // 检查并创建境界信息
    let realm = await Realm.findOne({ playerId });
    if (!realm) {
      const defaultRealmIndex = 0; // 凡人
      const defaultRealm = realmConfig.getRealmInfo(defaultRealmIndex);
      const defaultCap = realmConfig.calculateCap(defaultRealmIndex, 1);
      
      realm = new Realm({
        playerId,
        realmName: defaultRealm.name,
        realmIndex: defaultRealmIndex,
        realmLevel: 1,
        cultivationProgress: 0,
        cultivationCap: defaultCap
      });
      await realm.save();
    }

    // 检查并创建角色属性
    let attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      const initialAttributes = randomDistributeAttributes();
      const randomRoot = rootConfig.getRandomRoot();
      
      attributes = new CharacterAttribute({
        playerId,
        ...initialAttributes,
        freePoints: 20,
        root: randomRoot.name,
        rootBonus: randomRoot.bonus
      });
      await attributes.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        gameState: gameState.state,
        playerId: playerId
      }
    });
  } catch (error) {
    console.error('获取玩家游戏状态失败:', error);
    res.status(500).json({ status: 'error', message: '获取玩家游戏状态失败' });
  }
};

/**
 * 保存玩家游戏状态
 */
exports.savePlayerState = async (req, res) => {
  try {
    console.log('=== 保存玩家游戏状态请求 ===');
    console.log('请求体:', JSON.stringify(req.body, null, 2));

    const { playerId: rawPlayerId, gameState, lastSaveTime } = req.body;

    if (!rawPlayerId || !gameState) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID或游戏状态' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 查找或创建游戏状态
    let state = await GameState.findOne({ playerId });

    if (state) {
      // 更新现有状态
      state.state = gameState;
      state.updatedAt = new Date();
      if (lastSaveTime) {
        state.lastSaveTime = new Date(lastSaveTime);
      }
    } else {
      // 创建新状态
      state = new GameState({
        playerId,
        state: gameState,
        lastSaveTime: lastSaveTime ? new Date(lastSaveTime) : new Date()
      });
    }

    await state.save();

    console.log('游戏状态保存成功, playerId:', playerId);

    // 同时更新或创建玩家记录
    let player = await Player.findOne({ playerId });
    if (player) {
      player.lastLoginAt = new Date();
      await player.save();
    } else {
      // 创建玩家记录
      player = new Player({
        playerId,
        name: '修仙者',
        avatar: '/avatars/nan_shaolinsi.png',
        lastLoginAt: new Date()
      });
      await player.save();
    }

    // 检查并创建修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      cultivation = new Cultivation({
        playerId,
        isCultivating: false,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1.0,
        skillBonus: 1.0
      });
      await cultivation.save();
    }

    // 检查并创建境界信息
    let realm = await Realm.findOne({ playerId });
    if (!realm) {
      const defaultRealmIndex = 0; // 凡人
      const defaultRealm = realmConfig.getRealmInfo(defaultRealmIndex);
      const defaultCap = realmConfig.calculateCap(defaultRealmIndex, 1);
      
      realm = new Realm({
        playerId,
        realmName: defaultRealm.name,
        realmIndex: defaultRealmIndex,
        realmLevel: 1,
        cultivationProgress: 0,
        cultivationCap: defaultCap
      });
      await realm.save();
    }

    // 检查并创建角色属性
    let attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      const initialAttributes = randomDistributeAttributes();
      const randomRoot = rootConfig.getRandomRoot();
      
      attributes = new CharacterAttribute({
        playerId,
        ...initialAttributes,
        freePoints: 20,
        root: randomRoot.name,
        rootBonus: randomRoot.bonus
      });
      await attributes.save();
    }

    res.status(200).json({
      status: 'success',
      message: '保存成功',
      data: {
        playerId: playerId,
        lastSaveTime: state.lastSaveTime
      }
    });
  } catch (error) {
    console.error('保存玩家游戏状态失败:', error);
    res.status(500).json({ status: 'error', message: '保存玩家游戏状态失败' });
  }
};

/**
 * 获取玩家信息
 */
exports.getPlayerInfo = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    const player = await Player.findOne({ playerId: id });

    if (!player) {
      return res.status(404).json({ status: 'error', message: '玩家不存在' });
    }

    // 生成完整的头像URL
    let avatarUrl = player.avatar;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      // 构建完整的头像URL
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      avatarUrl = `${baseUrl}${avatarUrl}`;
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: player.playerId,
        name: player.name,
        avatar: avatarUrl
      }
    });
  } catch (error) {
    console.error('获取玩家信息失败:', error);
    res.status(500).json({ status: 'error', message: '获取玩家信息失败' });
  }
};

/**
 * 上传玩家头像
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 检查玩家是否存在
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({ status: 'error', message: '玩家不存在' });
    }

    // 处理文件上传
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ status: 'error', message: '缺少头像文件' });
    }

    const avatarFile = req.files.avatar;
    
    // 生成文件名
    const fileName = `${playerId}_${Date.now()}${path.extname(avatarFile.name)}`;
    const filePath = path.join(__dirname, '../uploads/avatars', fileName);

    // 保存文件
    await avatarFile.mv(filePath);

    // 更新玩家头像路径
    const avatarPath = `/avatars/${fileName}`;
    player.avatar = avatarPath;
    await player.save();

    // 生成完整的头像URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const avatarUrl = `${baseUrl}${avatarPath}`;

    res.status(200).json({
      status: 'success',
      message: '头像上传成功',
      data: {
        playerId: playerId,
        avatar: avatarUrl
      }
    });
  } catch (error) {
    console.error('上传头像失败:', error);
    res.status(500).json({ status: 'error', message: '上传头像失败' });
  }
};

/**
 * 获取角色完整信息
 */
exports.getCharacterInfo = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(id);

    // 获取玩家基本信息
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({ status: 'error', message: '玩家不存在' });
    }

    // 生成完整的头像URL
    let avatarUrl = player.avatar;
    if (avatarUrl && !avatarUrl.startsWith('http')) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      avatarUrl = `${baseUrl}${avatarUrl}`;
    }

    // 获取玩家装备
    const equipment = await Equipment.find({ playerId });

    // 获取修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      // 如果不存在，创建默认修炼状态
      cultivation = new Cultivation({
        playerId,
        isCultivating: false,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1.0,
        skillBonus: 1.0,
        expInterval: 30
      });
      await cultivation.save();
    }

    // 获取游戏状态
    let gameState = await GameState.findOne({ playerId });
    if (!gameState) {
      // 如果不存在，创建默认游戏状态
      gameState = new GameState({
        playerId,
        state: {
          energy: 0,
          fairyCrystal: 0,
          spiritStone: 0,
          isCultivating: cultivation.isCultivating
        },
        lastSaveTime: new Date()
      });
      await gameState.save();
    } else {
      // 确保gameState中的isCultivating与cultivation中的保持一致
      if (gameState.state.isCultivating !== cultivation.isCultivating) {
        gameState.state = {
          ...gameState.state,
          isCultivating: cultivation.isCultivating
        };
        await gameState.save();
      }
    }

    // 获取境界信息
    let realm = await Realm.findOne({ playerId });
    if (!realm) {
      // 如果不存在，创建默认境界信息（默认从凡人开始）
      const defaultRealmIndex = 0; // 凡人
      const defaultRealm = realmConfig.getRealmInfo(defaultRealmIndex);
      const defaultCap = realmConfig.calculateCap(defaultRealmIndex, 1);
      
      realm = new Realm({
        playerId,
        realmName: defaultRealm.name,
        realmIndex: defaultRealmIndex,
        realmLevel: 1,
        cultivationProgress: 0,
        cultivationCap: defaultCap
      });
      await realm.save();
    }

    // 获取角色属性
    let attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      // 随机分配初始属性点
      const initialAttributes = randomDistributeAttributes();
      // 随机获取跟脚
      const randomRoot = rootConfig.getRandomRoot();
      
      attributes = new CharacterAttribute({
        playerId,
        ...initialAttributes,
        freePoints: 20,
        root: randomRoot.name,
        rootBonus: randomRoot.bonus
      });
      await attributes.save();
    }

    // 获取玩家的功法列表
    const skills = await Skill.find({ playerId });
    const skillList = skills.map(skill => {
      const skillInfo = skillConfig.getSkillById(skill.skillId);
      const proficiencyInfo = skillConfig.getProficiencyInfo(skill.proficiency);
      const rankColor = rankColorConfig.getColorByLevel(skillInfo.rankLevel);
      
      return {
        skillId: skill.skillId,
        name: skillInfo.name,
        rank: skillInfo.rank,
        rankLevel: skillInfo.rankLevel,
        rankColor: rankColor,
        description: skillInfo.description,
        obtainMethod: skillInfo.obtainMethod,
        proficiency: skill.proficiency,
        proficiencyName: proficiencyInfo.name,
        proficiencyMultiplier: proficiencyInfo.multiplier,
        attributes: skillInfo.attributes
      };
    });

    // 确保gameState中的isCultivating与cultivation中的保持一致
    if (gameState.state.isCultivating !== cultivation.isCultivating) {
      gameState.state = {
        ...gameState.state,
        isCultivating: cultivation.isCultivating
      };
      await gameState.save();
    }

    // 构建响应数据
    const characterInfo = {
      player: {
        id: player.playerId,
        name: player.name,
        avatar: avatarUrl
      },
      attributes: {
        base: {
          constitution: attributes.constitution,
          agility: attributes.agility,
          luck: attributes.luck,
          wisdom: attributes.wisdom,
          freePoints: attributes.freePoints
        },
        root: {
          name: attributes.root,
          bonus: attributes.rootBonus,
          rankLevel: rootConfig.getRootByName(attributes.root)?.rankLevel || 1,
          rankColor: rankColorConfig.getColorByLevel(rootConfig.getRootByName(attributes.root)?.rankLevel || 1)
        },
        derived: attributes.derivedAttributes || {
          health: Math.floor((attributes.constitution || 0) * 10 * (1 + (attributes.rootBonus || 0))),
          mana: Math.floor((attributes.wisdom || 0) * 5 * (1 + (attributes.rootBonus || 0))),
          mental: Math.floor((attributes.wisdom || 0) * 4 * (1 + (attributes.rootBonus || 0))),
          attack: Math.floor((attributes.constitution || 0) * 3 * (1 + (attributes.rootBonus || 0))),
          defense: Math.floor((attributes.constitution || 0) * 2 * (1 + (attributes.rootBonus || 0))),
          speed: (attributes.agility || 0) * 1.5 * (1 + (attributes.rootBonus || 0)),
          dodge: (attributes.agility || 0) * 0.8 * (1 + (attributes.rootBonus || 0)),
          criticalRate: (attributes.luck || 0) * 0.5 * (1 + (attributes.rootBonus || 0))
        }
      },
      equipment: equipment.map(item => ({
        type: item.type,
        name: item.name,
        quality: item.quality,
        qualityColor: rankColorConfig.getColorByLevel(item.quality),
        level: item.level,
        attributes: item.attributes
      })),
      skills: skillList,
      cultivation: {
        isCultivating: cultivation.isCultivating,
        efficiency: cultivation.efficiency,
        baseCultivation: cultivation.baseCultivation,
        rootBonus: cultivation.rootBonus,
        skillBonus: cultivation.skillBonus,
        expInterval: cultivation.expInterval || 30,
        realTimeEfficiency: cultivation.realTimeEfficiency || cultivation.baseCultivation * (cultivation.rootBonus + cultivation.skillBonus)
      },
      realm: {
        realmName: realm.realmName,
        realmLevel: realm.realmLevel,
        cultivationProgress: realm.cultivationProgress,
        cultivationCap: realm.cultivationCap,
        progressPercentage: realm.progressPercentage || Math.min(Math.round((realm.cultivationProgress / realm.cultivationCap) * 100), 100)
      },
      gameState: gameState.state
    };

    res.status(200).json({
      status: 'success',
      data: characterInfo
    });
  } catch (error) {
    console.error('获取角色完整信息失败:', error);
    res.status(500).json({ status: 'error', message: '获取角色完整信息失败' });
  }
};

/**
 * 开始修炼
 */
exports.startCultivation = async (req, res) => {
  try {
    const { playerId: rawPlayerId } = req.body;

    if (!rawPlayerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 获取角色属性，以获取正确的rootBonus
    let attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      // 如果不存在，创建默认角色属性
      const initialAttributes = randomDistributeAttributes();
      const randomRoot = rootConfig.getRandomRoot();
      
      attributes = new CharacterAttribute({
        playerId,
        ...initialAttributes,
        freePoints: 20,
        root: randomRoot.name,
        rootBonus: randomRoot.bonus
      });
      await attributes.save();
    }

    // 获取或创建修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      cultivation = new Cultivation({
        playerId,
        isCultivating: true,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1 + attributes.rootBonus,
        skillBonus: 1.0,
        expInterval: 30,
        startTime: new Date()
      });
    } else {
      cultivation.isCultivating = true;
      cultivation.startTime = new Date();
      cultivation.endTime = null;
      // 更新rootBonus以确保与角色属性一致
      cultivation.rootBonus = 1 + attributes.rootBonus;
      // 确保expInterval有值
      if (!cultivation.expInterval) {
        cultivation.expInterval = 30;
      }
    }

    await cultivation.save();

    // 同时更新GameState中的isCultivating状态
    let gameState = await GameState.findOne({ playerId });
    if (gameState) {
      gameState.state = {
        ...gameState.state,
        isCultivating: true
      };
      await gameState.save();
    } else {
      // 如果GameState不存在，创建一个新的
      gameState = new GameState({
        playerId,
        state: {
          energy: 0,
          fairyCrystal: 0,
          spiritStone: 0,
          isCultivating: true
        },
        lastSaveTime: new Date()
      });
      await gameState.save();
    }

    res.status(200).json({
      status: 'success',
      message: '开始修炼成功',
      data: {
        isCultivating: true,
        startTime: cultivation.startTime,
        realTimeEfficiency: cultivation.realTimeEfficiency
      }
    });
  } catch (error) {
    console.error('开始修炼失败:', error);
    res.status(500).json({ status: 'error', message: '开始修炼失败' });
  }
};

/**
 * 停止修炼
 */
exports.stopCultivation = async (req, res) => {
  try {
    const { playerId: rawPlayerId } = req.body;

    if (!rawPlayerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 获取修炼状态
    const cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      return res.status(404).json({ status: 'error', message: '修炼状态不存在' });
    }

    cultivation.isCultivating = false;
    cultivation.endTime = new Date();

    await cultivation.save();

    // 同时更新GameState中的isCultivating状态
    let gameState = await GameState.findOne({ playerId });
    if (gameState) {
      gameState.state = {
        ...gameState.state,
        isCultivating: false
      };
      await gameState.save();
    } else {
      // 如果GameState不存在，创建一个新的
      gameState = new GameState({
        playerId,
        state: {
          energy: 0,
          fairyCrystal: 0,
          spiritStone: 0,
          isCultivating: false
        },
        lastSaveTime: new Date()
      });
      await gameState.save();
    }

    res.status(200).json({
      status: 'success',
      message: '停止修炼成功',
      data: {
        isCultivating: false,
        endTime: cultivation.endTime
      }
    });
  } catch (error) {
    console.error('停止修炼失败:', error);
    res.status(500).json({ status: 'error', message: '停止修炼失败' });
  }
};

/**
 * 分配属性点
 */
exports.allocateAttributePoints = async (req, res) => {
  try {
    const { playerId: rawPlayerId, constitution = 0, agility = 0, luck = 0, wisdom = 0 } = req.body;

    if (!rawPlayerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 获取角色属性
    const attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      return res.status(404).json({ status: 'error', message: '角色属性不存在' });
    }

    // 计算需要的属性点
    const totalPoints = constitution + agility + luck + wisdom;
    if (totalPoints > attributes.freePoints) {
      return res.status(400).json({ status: 'error', message: '自由属性点不足' });
    }

    // 分配属性点
    attributes.constitution += constitution;
    attributes.agility += agility;
    attributes.luck += luck;
    attributes.wisdom += wisdom;
    attributes.freePoints -= totalPoints;
    attributes.updatedAt = new Date();

    await attributes.save();

    res.status(200).json({
      status: 'success',
      message: '属性点分配成功',
      data: {
        base: {
          constitution: attributes.constitution,
          agility: attributes.agility,
          luck: attributes.luck,
          wisdom: attributes.wisdom,
          freePoints: attributes.freePoints
        },
        derived: attributes.derivedAttributes
      }
    });
  } catch (error) {
    console.error('分配属性点失败:', error);
    res.status(500).json({ status: 'error', message: '分配属性点失败' });
  }
};

/**
 * 刷新跟脚
 */
exports.refreshRoot = async (req, res) => {
  try {
    const { playerId: rawPlayerId } = req.body;

    if (!rawPlayerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 获取角色属性
    const attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      return res.status(404).json({ status: 'error', message: '角色属性不存在' });
    }

    // 随机获取新跟脚
    const newRoot = rootConfig.getRandomRoot();
    attributes.root = newRoot.name;
    attributes.rootBonus = newRoot.bonus;
    attributes.updatedAt = new Date();

    await attributes.save();

    // 获取修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      cultivation = new Cultivation({
        playerId,
        isCultivating: false,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1.0,
        skillBonus: 1.0
      });
      await cultivation.save();
    }

    // 更新修炼状态中的根骨加成
    cultivation.rootBonus = 1 + attributes.rootBonus;
    await cultivation.save();

    res.status(200).json({
      status: 'success',
      message: '跟脚刷新成功',
      data: {
        root: {
          name: attributes.root,
          bonus: attributes.rootBonus,
          rankLevel: rootConfig.getRootByName(attributes.root)?.rankLevel || 1,
          rankColor: rankColorConfig.getColorByLevel(rootConfig.getRootByName(attributes.root)?.rankLevel || 1)
        },
        base: {
          constitution: attributes.constitution,
          agility: attributes.agility,
          luck: attributes.luck,
          wisdom: attributes.wisdom,
          freePoints: attributes.freePoints
        },
        derived: attributes.derivedAttributes,
        cultivation: {
          isCultivating: cultivation.isCultivating,
          efficiency: cultivation.efficiency,
          baseCultivation: cultivation.baseCultivation,
          rootBonus: cultivation.rootBonus,
          skillBonus: cultivation.skillBonus,
          realTimeEfficiency: cultivation.realTimeEfficiency || cultivation.baseCultivation * (cultivation.rootBonus + cultivation.skillBonus)
        }
      }
    });
  } catch (error) {
    console.error('刷新跟脚失败:', error);
    res.status(500).json({ status: 'error', message: '刷新跟脚失败' });
  }
};

/**
 * 学习功法
 */
exports.learnSkill = async (req, res) => {
  try {
    const { playerId: rawPlayerId, skillId } = req.body;

    if (!rawPlayerId || !skillId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID或功法ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 检查功法是否存在
    const skillInfo = skillConfig.getSkillById(skillId);
    if (!skillInfo) {
      return res.status(404).json({ status: 'error', message: '功法不存在' });
    }

    // 检查玩家是否已经学习了该功法
    let skill = await Skill.findOne({ playerId, skillId });
    if (skill) {
      return res.status(400).json({ status: 'error', message: '已经学习过该功法' });
    }

    // 学习功法
    skill = new Skill({
      playerId,
      skillId,
      proficiency: 1
    });

    await skill.save();

    res.status(200).json({
      status: 'success',
      message: '学习功法成功',
      data: {
        skillId: skill.skillId,
        name: skillInfo.name,
        rank: skillInfo.rank,
        proficiency: skill.proficiency,
        proficiencyName: skillConfig.getProficiencyInfo(skill.proficiency).name
      }
    });
  } catch (error) {
    console.error('学习功法失败:', error);
    res.status(500).json({ status: 'error', message: '学习功法失败' });
  }
};

/**
 * 提升功法熟练度
 */
exports.upgradeSkill = async (req, res) => {
  try {
    const { playerId: rawPlayerId, skillId } = req.body;

    if (!rawPlayerId || !skillId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID或功法ID' });
    }

    // 确保playerId是字符串类型，与其他接口保持一致
    const playerId = String(rawPlayerId);

    // 检查玩家是否学习了该功法
    let skill = await Skill.findOne({ playerId, skillId });
    if (!skill) {
      return res.status(404).json({ status: 'error', message: '未学习该功法' });
    }

    // 检查熟练度是否已经达到上限
    if (skill.proficiency >= 7) {
      return res.status(400).json({ status: 'error', message: '功法熟练度已达到上限' });
    }

    // 提升熟练度
    skill.proficiency++;
    skill.updatedAt = new Date();

    await skill.save();

    const skillInfo = skillConfig.getSkillById(skillId);
    const proficiencyInfo = skillConfig.getProficiencyInfo(skill.proficiency);

    res.status(200).json({
      status: 'success',
      message: '提升功法熟练度成功',
      data: {
        skillId: skill.skillId,
        name: skillInfo.name,
        proficiency: skill.proficiency,
        proficiencyName: proficiencyInfo.name,
        proficiencyMultiplier: proficiencyInfo.multiplier
      }
    });
  } catch (error) {
    console.error('提升功法熟练度失败:', error);
    res.status(500).json({ status: 'error', message: '提升功法熟练度失败' });
  }
};

/**
 * 获取玩家功法列表
 */
exports.getPlayerSkills = async (req, res) => {
  try {
    const { playerId } = req.query;

    if (!playerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    // 获取玩家的所有功法
    const skills = await Skill.find({ playerId });

    // 构建响应数据
    const skillList = skills.map(skill => {
      const skillInfo = skillConfig.getSkillById(skill.skillId);
      const proficiencyInfo = skillConfig.getProficiencyInfo(skill.proficiency);
      const rankColor = rankColorConfig.getColorByLevel(skillInfo.rankLevel);
      
      return {
        skillId: skill.skillId,
        name: skillInfo.name,
        rank: skillInfo.rank,
        rankLevel: skillInfo.rankLevel,
        rankColor: rankColor,
        description: skillInfo.description,
        obtainMethod: skillInfo.obtainMethod,
        proficiency: skill.proficiency,
        proficiencyName: proficiencyInfo.name,
        proficiencyMultiplier: proficiencyInfo.multiplier,
        attributes: skillInfo.attributes
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        skills: skillList
      }
    });
  } catch (error) {
    console.error('获取玩家功法列表失败:', error);
    res.status(500).json({ status: 'error', message: '获取玩家功法列表失败' });
  }
};