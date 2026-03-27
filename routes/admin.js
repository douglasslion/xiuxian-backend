/**
 * 后台管理路由
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Player = require('../models/Player');
const GameState = require('../models/GameState');

// 获取所有用户
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // 不返回密码
    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ status: 'error', message: '获取用户列表失败' });
  }
});

// 获取所有角色
router.get('/characters', async (req, res) => {
  try {
    const characters = await Player.find();
    res.status(200).json({
      status: 'success',
      data: characters
    });
  } catch (error) {
    console.error('获取角色列表失败:', error);
    res.status(500).json({ status: 'error', message: '获取角色列表失败' });
  }
});

// 获取所有游戏状态
router.get('/game-states', async (req, res) => {
  try {
    const gameStates = await GameState.find();
    res.status(200).json({
      status: 'success',
      data: gameStates
    });
  } catch (error) {
    console.error('获取游戏状态失败:', error);
    res.status(500).json({ status: 'error', message: '获取游戏状态失败' });
  }
});

module.exports = router;