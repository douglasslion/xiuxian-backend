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
      { new: true, upsert: true }
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
    const { playerId } = req.params;

    if (!playerId) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID' });
    }

    const gameState = await GameState.findOne({ playerId });

    if (!gameState) {
      return res.status(404).json({ status: 'error', message: '游戏状态不存在' });
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

    const { playerId, gameState, lastSaveTime } = req.body;

    if (!playerId || !gameState) {
      return res.status(400).json({ status: 'error', message: '缺少玩家ID或游戏状态' });
    }

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
        lastLoginAt: new Date()
      });
      await player.save();
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

    // 获取玩家基本信息
    const player = await Player.findOne({ playerId: id });
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
    const equipment = await Equipment.find({ playerId: id });

    // 获取修炼状态
    let cultivation = await Cultivation.findOne({ playerId: id });
    if (!cultivation) {
      // 如果不存在，创建默认修炼状态
      cultivation = new Cultivation({
        playerId: id,
        isCultivating: false,
        efficiency: 1.0
      });
      await cultivation.save();
    }

    // 获取境界信息
    let realm = await Realm.findOne({ playerId: id });
    if (!realm) {
      // 如果不存在，创建默认境界信息
      realm = new Realm({
        playerId: id,
        realmName: '练气',
        realmLevel: 1,
        cultivationProgress: 0,
        cultivationCap: 100
      });
      await realm.save();
    }

    // 构建响应数据
    const characterInfo = {
      player: {
        id: player.playerId,
        name: player.name,
        avatar: avatarUrl
      },
      equipment: equipment.map(item => ({
        type: item.type,
        name: item.name,
        quality: item.quality,
        level: item.level,
        attributes: item.attributes
      })),
      cultivation: {
        isCultivating: cultivation.isCultivating,
        efficiency: cultivation.efficiency
      },
      realm: {
        realmName: realm.realmName,
        realmLevel: realm.realmLevel,
        cultivationProgress: realm.cultivationProgress,
        cultivationCap: realm.cultivationCap,
        progressPercentage: realm.progressPercentage
      }
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
