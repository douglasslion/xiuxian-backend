/**
 * 游戏相关路由
 */

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

// 获取游戏状态
router.get('/state', gameController.getGameState);

// 保存游戏状态
router.post('/state', gameController.saveGameState);

// 获取游戏配置
router.get('/config', gameController.getGameConfig);

// 获取排行榜
router.get('/ranking', gameController.getRanking);

// 提交分数
router.post('/score', gameController.submitScore);

module.exports = router;
