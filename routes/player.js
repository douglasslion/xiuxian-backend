/**
 * 玩家相关路由
 */

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player');

// 获取新玩家ID (从861117开始累计)
router.get('/new-id', playerController.getNewPlayerId);

// 获取玩家信息
router.get('/info', playerController.getPlayerInfo);

// 上传玩家头像
router.post('/avatar', playerController.uploadAvatar);

// 获取角色完整信息
router.get('/character-info', playerController.getCharacterInfo);

// 获取玩家游戏状态
router.get('/:playerId', playerController.getPlayerState);

// 保存玩家游戏状态
router.post('/:playerId', playerController.savePlayerState);

// 开始修炼
router.post('/cultivation/start', playerController.startCultivation);

// 停止修炼
router.post('/cultivation/stop', playerController.stopCultivation);

// 分配属性点
router.post('/attributes/allocate', playerController.allocateAttributePoints);

// 刷新跟脚
router.post('/attributes/refresh-root', playerController.refreshRoot);

// 学习功法
router.post('/skills/learn', playerController.learnSkill);

// 提升功法熟练度
router.post('/skills/upgrade', playerController.upgradeSkill);

// 获取玩家功法列表
router.get('/skills', playerController.getPlayerSkills);

module.exports = router;
