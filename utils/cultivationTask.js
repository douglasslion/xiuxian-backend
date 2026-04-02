/**
 * 修炼任务 - 定时发放修炼经验
 */

const Cultivation = require('../models/Cultivation');
const Realm = require('../models/Realm');
const Player = require('../models/Player');
const realmConfig = require('../config/realmConfig');

/**
 * 发放修炼经验
 */
async function grantCultivationExperience() {
  try {
    // 获取所有正在修炼的玩家
    const cultivatingPlayers = await Cultivation.find({ isCultivating: true });
    
    for (const cultivation of cultivatingPlayers) {
      try {
        // 检查是否到了发放经验的时间
        if (!shouldGrantExperience(cultivation)) {
          continue;
        }
        
        // 获取玩家信息
        const player = await Player.findOne({ playerId: cultivation.playerId });
        if (!player) {
          console.error(`玩家 ${cultivation.playerId} 不存在`);
          continue;
        }
        
        // 获取境界信息
        let realm = await Realm.findOne({ playerId: cultivation.playerId });
        if (!realm) {
          console.error(`玩家 ${cultivation.playerId} 境界信息不存在`);
          continue;
        }
        
        // 计算本次应获得的经验
        const experience = calculateExperience(cultivation);
        
        // 检查是否可以增加经验
        if (canAddExperience(realm, player.isVip, experience)) {
          // 增加经验
          realm.cultivationProgress += experience;
          
          // 检查是否可以突破境界
          if (realm.cultivationProgress >= realm.cultivationCap) {
            // 处理突破逻辑
            await handleBreakthrough(realm, player);
          } else {
            // 保存经验
            await realm.save();
          }
          console.log(`玩家 ${cultivation.playerId} 获得 ${experience} 修炼经验`);
        } else {
          console.log(`玩家 ${cultivation.playerId} 经验已达上限，不再增加`);
        }
        
        // 更新上次发放经验的时间
        cultivation.lastGrantTime = new Date();
        await cultivation.save();
      } catch (error) {
        console.error(`处理玩家 ${cultivation.playerId} 修炼经验时出错:`, error);
      }
    }
  } catch (error) {
    console.error('发放修炼经验失败:', error);
  }
}

/**
 * 检查是否应该发放经验
 */
function shouldGrantExperience(cultivation) {
  const now = new Date();
  const expInterval = cultivation.expInterval || 30; // 默认30秒
  
  if (!cultivation.lastGrantTime) {
    // 第一次发放
    console.log(`玩家 ${cultivation.playerId} 第一次发放经验`);
    return true;
  }
  
  // 计算距离上次发放经验的时间差（秒）
  const timeDiff = (now - cultivation.lastGrantTime) / 1000;
  
  // 添加调试信息
  if (cultivation.playerId === "4") {
    console.log(`玩家 ${cultivation.playerId} 时间差: ${timeDiff.toFixed(2)}秒, 间隔: ${expInterval}秒, 是否应该发放: ${timeDiff >= expInterval}`);
  }
  
  // 如果时间差大于等于经验获取间隔，则发放经验
  return timeDiff >= expInterval;
}

/**
 * 计算本次应获得的经验
 */
function calculateExperience(cultivation) {
  // 基于修炼效率计算经验
  return cultivation.baseCultivation * (cultivation.rootBonus + cultivation.skillBonus);
}

/**
 * 检查是否可以增加经验
 */
function canAddExperience(realm, isVip, experience) {
  if (isVip) {
    // VIP玩家可以积累到当前等级上限的10倍
    return realm.cultivationProgress + experience <= realm.cultivationCap * 10;
  } else {
    // 非VIP玩家只能积累到当前等级上限
    return realm.cultivationProgress + experience <= realm.cultivationCap;
  }
}

/**
 * 处理突破逻辑
 */
async function handleBreakthrough(realm, player) {
  // 计算剩余经验
  const remainingExp = realm.cultivationProgress - realm.cultivationCap;
  
  // 提升境界
  const nextRealmIndex = realm.realmIndex + 1;
  const nextRealm = realmConfig.getRealmInfo(nextRealmIndex);
  
  if (nextRealm) {
    // 有下一个境界
    realm.realmIndex = nextRealmIndex;
    realm.realmName = nextRealm.name;
    realm.realmLevel = 1;
    realm.cultivationCap = realmConfig.calculateCap(nextRealmIndex, 1);
    realm.cultivationProgress = remainingExp;
    
    console.log(`玩家 ${player.playerId} 突破到 ${nextRealm.name}`);
  } else {
    // 已达到最高境界
    realm.cultivationProgress = realm.cultivationCap;
    console.log(`玩家 ${player.playerId} 已达到最高境界`);
  }
  
  // 保存突破后的境界信息
  await realm.save();
}

/**
 * 启动修炼任务
 */
function startCultivationTask() {
  // 每1秒检查一次，根据玩家的expInterval来决定是否发放经验
  setInterval(grantCultivationExperience, 1000);
  console.log('修炼任务已启动');
}

module.exports = {
  startCultivationTask,
  grantCultivationExperience
};