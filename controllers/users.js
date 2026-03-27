/**
 * 用户控制器
 */

const User = require('../models/User');
const Player = require('../models/Player');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: '用户名和密码为必填项' });
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '用户名已存在' });
    }
    
    // 创建新用户
    const user = new User({
      username,
      password
    });
    
    await user.save();
    
    // 检查是否有角色信息
    let playerInfo = null;
    if (user.playerId) {
      const player = await Player.findOne({ playerId: user.playerId });
      if (player) {
        playerInfo = {
          id: player.playerId,
          name: player.name,
          avatar: player.avatar
        };
      }
    }
    
    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: {
        user: {
          id: user._id,
          username: user.username
        },
        player: playerInfo,
        needCreateCharacter: !playerInfo
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    // 检查是否是MongoDB验证错误
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ status: 'error', message: messages.join(', ') });
    }
    // 检查是否是MongoDB唯一索引错误
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ status: 'error', message: `${field === 'username' ? '用户名' : field}已存在` });
    }
    res.status(500).json({ status: 'error', message: '注册失败，请稍后重试' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ status: 'error', message: '该账号尚未注册，请注册后再登录。' });
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'error', message: '密码错误' });
    }
    
    // 检查是否有角色信息
    let playerInfo = null;
    if (user.playerId) {
      const player = await Player.findOne({ playerId: user.playerId });
      if (player) {
        playerInfo = {
          id: player.playerId,
          name: player.name,
          avatar: player.avatar
        };
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: {
        user: {
          id: user._id,
          username: user.username
        },
        player: playerInfo,
        needCreateCharacter: !playerInfo
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ status: 'error', message: '登录失败' });
  }
};

// 获取用户信息
exports.getProfile = async (req, res) => {
  try {
    // 这里应该从token中获取用户ID
    const userId = req.user?.id || 'test_user_id';
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ status: 'error', message: '获取用户信息失败' });
  }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
  try {
    // 这里应该从token中获取用户ID
    const userId = req.user?.id || 'test_user_id';
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({ status: 'success', message: '更新成功', data: user });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ status: 'error', message: '更新用户信息失败' });
  }
};

// 创建角色
exports.createCharacter = async (req, res) => {
  try {
    const { userId, name, avatar } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ status: 'error', message: '缺少用户ID或角色名称' });
    }
    
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    // 生成新的玩家ID
    const PlayerCounter = require('../models/PlayerCounter');
    const counter = await PlayerCounter.findOneAndUpdate(
      { counterName: 'playerId' },
      { $inc: { nextId: 1 }, $set: { updatedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    const playerId = (counter.nextId - 1).toString();
    
    // 创建玩家角色
    const player = new Player({
      playerId,
      name,
      avatar: avatar || '/avatars/nan_shaolinsi.png',
      lastLoginAt: new Date()
    });
    
    await player.save();
    
    // 更新用户的playerId
    user.playerId = playerId;
    await user.save();
    
    // 初始化默认游戏状态数据
    const GameState = require('../models/GameState');
    const Cultivation = require('../models/Cultivation');
    const Realm = require('../models/Realm');
    const CharacterAttribute = require('../models/CharacterAttribute');
    const realmConfig = require('../config/realmConfig');
    const rootConfig = require('../config/rootConfig');
    const { randomDistributeAttributes } = require('../utils/attributeUtils');
    
    // 创建默认游戏状态
    const gameState = new GameState({
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
    
    // 创建默认修炼状态
    const cultivation = new Cultivation({
      playerId,
      isCultivating: false,
      efficiency: 1.0,
      baseCultivation: 10,
      rootBonus: 1.0,
      skillBonus: 1.0
    });
    await cultivation.save();
    
    // 创建默认境界信息（默认从凡人开始）
    const defaultRealmIndex = 0; // 凡人
    const defaultRealm = realmConfig.getRealmInfo(defaultRealmIndex);
    const defaultCap = realmConfig.calculateCap(defaultRealmIndex, 1);
    
    const realm = new Realm({
      playerId,
      realmName: defaultRealm.name,
      realmIndex: defaultRealmIndex,
      realmLevel: 1,
      cultivationProgress: 0,
      cultivationCap: defaultCap
    });
    await realm.save();
    
    // 创建默认角色属性
    const initialAttributes = randomDistributeAttributes();
    const randomRoot = rootConfig.getRandomRoot();
    
    const attributes = new CharacterAttribute({
      playerId,
      ...initialAttributes,
      freePoints: 20,
      root: randomRoot.name,
      rootBonus: randomRoot.bonus
    });
    await attributes.save();
    
    res.status(200).json({
      status: 'success',
      message: '角色创建成功',
      data: {
        player: {
          id: player.playerId,
          name: player.name,
          avatar: player.avatar
        }
      }
    });
  } catch (error) {
    console.error('创建角色失败:', error);
    res.status(500).json({ status: 'error', message: '创建角色失败' });
  }
};
