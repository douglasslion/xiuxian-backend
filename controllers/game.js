/**
 * 游戏控制器
 */

const GameState = require('../models/GameState');
const GameConfig = require('../models/GameConfig');
const Ranking = require('../models/Ranking');

// 获取游戏状态
exports.getGameState = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ status: 'error', message: '缺少用户ID' });
    }
    
    const gameState = await GameState.findOne({ userId });
    
    if (!gameState) {
      return res.status(404).json({ status: 'error', message: '游戏状态不存在' });
    }
    
    res.status(200).json({ status: 'success', data: gameState });
  } catch (error) {
    console.error('获取游戏状态失败:', error);
    res.status(500).json({ status: 'error', message: '获取游戏状态失败' });
  }
};

// 保存游戏状态
exports.saveGameState = async (req, res) => {
  try {
    const { userId, state } = req.body;
    
    if (!userId || !state) {
      return res.status(400).json({ status: 'error', message: '缺少用户ID或游戏状态' });
    }
    
    // 查找或创建游戏状态
    let gameState = await GameState.findOne({ userId });
    
    if (gameState) {
      // 更新现有状态
      gameState.state = state;
      gameState.updatedAt = new Date();
    } else {
      // 创建新状态
      gameState = new GameState({
        userId,
        state
      });
    }
    
    await gameState.save();
    
    res.status(200).json({ status: 'success', message: '保存成功', data: gameState });
  } catch (error) {
    console.error('保存游戏状态失败:', error);
    res.status(500).json({ status: 'error', message: '保存游戏状态失败' });
  }
};

// 获取游戏配置
exports.getGameConfig = async (req, res) => {
  try {
    const config = await GameConfig.findOne({});
    
    if (!config) {
      // 如果没有配置，返回默认配置
      return res.status(200).json({ status: 'success', data: {
        version: '1.0.0',
        realms: [],
        skills: [],
        equipment: []
      }});
    }
    
    res.status(200).json({ status: 'success', data: config });
  } catch (error) {
    console.error('获取游戏配置失败:', error);
    res.status(500).json({ status: 'error', message: '获取游戏配置失败' });
  }
};

// 获取排行榜
exports.getRanking = async (req, res) => {
  try {
    const rankings = await Ranking.find().sort({ score: -1 }).limit(100);
    
    res.status(200).json({ status: 'success', data: rankings });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ status: 'error', message: '获取排行榜失败' });
  }
};

// 提交分数
exports.submitScore = async (req, res) => {
  try {
    const { userId, username, score } = req.body;
    
    if (!userId || !score) {
      return res.status(400).json({ status: 'error', message: '缺少用户ID或分数' });
    }
    
    // 查找或创建排行榜记录
    let ranking = await Ranking.findOne({ userId });
    
    if (ranking) {
      // 更新现有记录
      if (score > ranking.score) {
        ranking.score = score;
        ranking.updatedAt = new Date();
      }
    } else {
      // 创建新记录
      ranking = new Ranking({
        userId,
        username,
        score
      });
    }
    
    await ranking.save();
    
    res.status(200).json({ status: 'success', message: '提交成功', data: ranking });
  } catch (error) {
    console.error('提交分数失败:', error);
    res.status(500).json({ status: 'error', message: '提交分数失败' });
  }
};
