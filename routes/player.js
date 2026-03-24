/**
 * 玩家相关路由
 */

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player');

// 获取新玩家ID (从861117开始累计)
router.get('/new-id', playerController.getNewPlayerId);

// 获取玩家游戏状态
router.get('/:playerId', playerController.getPlayerState);

// 保存玩家游戏状态
router.post('/:playerId', playerController.savePlayerState);

module.exports = router;
