/**
 * 用户控制器
 */

const User = require('../models/User');
const Player = require('../models/Player');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '用户名已存在' });
    }
    
    // 创建新用户
    const user = new User({
      username,
      password,
      email
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
          username: user.username,
          email: user.email
        },
        player: playerInfo,
        needCreateCharacter: !playerInfo
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ status: 'error', message: '注册失败' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ status: 'error', message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'error', message: '用户名或密码错误' });
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
          username: user.username,
          email: user.email
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
      { new: true, upsert: true }
    );
    
    const playerId = (counter.nextId - 1).toString();
    
    // 创建玩家角色
    const player = new Player({
      playerId,
      name,
      avatar: avatar || '',
      lastLoginAt: new Date()
    });
    
    await player.save();
    
    // 更新用户的playerId
    user.playerId = playerId;
    await user.save();
    
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
