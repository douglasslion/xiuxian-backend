/**
 * 修仙游戏后端服务
 * 主入口文件
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
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

// 路由配置
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game');
const playerRoutes = require('./routes/player');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/player', playerRoutes);

// 测试玩家ID API
app.get('/api/test/new-id', async (req, res) => {
  try {
    console.log('测试获取新玩家ID');
    const PlayerCounter = require('./models/PlayerCounter');

    const counter = await PlayerCounter.findOneAndUpdate(
      { counterName: 'playerId' },
      { $inc: { nextId: 1 }, $set: { updatedAt: new Date() } },
      { new: true, upsert: true }
    );

    const newId = counter.nextId - 1;

    console.log('测试分配新玩家ID:', newId);

    res.status(200).json({
      status: 'success',
      data: {
        playerId: newId.toString()
      }
    });
  } catch (error) {
    console.error('测试获取新玩家ID失败:', error);
    res.status(500).json({ status: 'error', message: '测试失败' });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '修仙游戏后端服务运行正常' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ status: 'error', message: '服务器内部错误' });
});

// 启动服务
const PORT = process.env.PORT || 8002;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`服务运行在端口 ${PORT}`);
  });
});
