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

// 获取玩家信息
router.get('/info', playerController.getPlayerInfo);

// 上传玩家头像
router.post('/avatar', playerController.uploadAvatar);

// 获取角色完整信息
router.get('/character-info', playerController.getCharacterInfo);

module.exports = router;
