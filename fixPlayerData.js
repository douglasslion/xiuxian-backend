/**
 * 修复玩家ID 4的角色数据
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入模型
const Player = require('./models/Player');
const GameState = require('./models/GameState');
const Cultivation = require('./models/Cultivation');
const Realm = require('./models/Realm');
const CharacterAttribute = require('./models/CharacterAttribute');
const Equipment = require('./models/Equipment');
const Skill = require('./models/Skill');

// 导入配置
const realmConfig = require('./config/realmConfig');
const rootConfig = require('./config/rootConfig');

// 连接数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

// 随机分配初始属性点
function randomDistributeAttributes() {
  const totalPoints = 20;
  const attributes = { constitution: 1, agility: 1, luck: 1, wisdom: 1 };
  let remainingPoints = totalPoints - 4; // 每个属性至少1点

  while (remainingPoints > 0) {
    const attribute = Object.keys(attributes)[Math.floor(Math.random() * 4)];
    if (attributes[attribute] < 8) { // 单属性最大8点
      attributes[attribute]++;
      remainingPoints--;
    }
  }

  return attributes;
}

// 修复玩家数据
const fixPlayerData = async (playerId) => {
  try {
    console.log(`开始修复玩家ID ${playerId} 的角色数据...`);

    // 1. 检查玩家基本信息
    let player = await Player.findOne({ playerId });
    if (!player) {
      console.error('玩家不存在');
      return;
    }
    console.log('玩家基本信息:', player);

    // 2. 检查游戏状态
    let gameState = await GameState.findOne({ playerId });
    if (!gameState) {
      console.log('创建默认游戏状态...');
      gameState = new GameState({
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
      console.log('游戏状态创建成功');
    }

    // 3. 检查修炼状态
    let cultivation = await Cultivation.findOne({ playerId });
    if (!cultivation) {
      console.log('创建默认修炼状态...');
      cultivation = new Cultivation({
        playerId,
        isCultivating: false,
        efficiency: 1.0,
        baseCultivation: 10,
        rootBonus: 1.0,
        skillBonus: 1.0
      });
      await cultivation.save();
      console.log('修炼状态创建成功');
    }

    // 4. 检查境界信息
    let realm = await Realm.findOne({ playerId });
    if (!realm) {
      console.log('创建默认境界信息...');
      const defaultRealmIndex = 0; // 凡人
      const defaultRealm = realmConfig.getRealmInfo(defaultRealmIndex);
      const defaultCap = realmConfig.calculateCap(defaultRealmIndex, 1);
      
      realm = new Realm({
        playerId,
        realmName: defaultRealm.name,
        realmIndex: defaultRealmIndex,
        realmLevel: 1,
        cultivationProgress: 0,
        cultivationCap: defaultCap
      });
      await realm.save();
      console.log('境界信息创建成功');
    }

    // 5. 检查角色属性
    let attributes = await CharacterAttribute.findOne({ playerId });
    if (!attributes) {
      console.log('创建默认角色属性...');
      const initialAttributes = randomDistributeAttributes();
      const randomRoot = rootConfig.getRandomRoot();
      
      attributes = new CharacterAttribute({
        playerId,
        ...initialAttributes,
        freePoints: 20,
        root: randomRoot.name,
        rootBonus: randomRoot.bonus
      });
      await attributes.save();
      console.log('角色属性创建成功');
    }

    // 6. 检查装备
    const equipment = await Equipment.find({ playerId });
    if (equipment.length === 0) {
      console.log('玩家无装备，无需修复');
    }

    // 7. 检查功法
    const skills = await Skill.find({ playerId });
    if (skills.length === 0) {
      console.log('玩家无功法，无需修复');
    }

    console.log(`玩家ID ${playerId} 的角色数据修复完成`);
  } catch (error) {
    console.error('修复玩家数据失败:', error);
  } finally {
    mongoose.connection.close();
  }
};

// 执行修复
connectDB().then(() => {
  fixPlayerData(4);
});