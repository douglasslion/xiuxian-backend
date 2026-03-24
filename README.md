# 修仙游戏后端服务

## 项目结构

```
backend/
├── app.js              # 主入口文件
├── package.json        # 项目配置
├── .env                # 环境变量配置
├── routes/             # 路由
│   ├── users.js        # 用户相关路由
│   └── game.js         # 游戏相关路由
├── controllers/        # 控制器
│   ├── users.js        # 用户控制器
│   └── game.js         # 游戏控制器
├── models/             # 数据模型
│   ├── User.js         # 用户模型
│   ├── GameState.js    # 游戏状态模型
│   ├── GameConfig.js   # 游戏配置模型
│   └── Ranking.js      # 排行榜模型
├── middleware/         # 中间件
└── utils/              # 工具函数
```

## 环境要求

- Node.js 14+
- MongoDB 4.0+

## 安装依赖

```bash
cd backend
npm install
```

## 配置环境变量

编辑 `.env` 文件，设置数据库连接等配置：

```
# 服务器配置
PORT=8000
NODE_ENV=development

# 数据库配置
MONGO_URI=mongodb://localhost:27017/xiuxian_test

# 密钥
JWT_SECRET=your_jwt_secret_key

# 游戏配置
GAME_VERSION=1.0.0
```

## 启动服务

### 开发模式

```bash
npm run dev
```

### 生产模式

```bash
pm start
```

### 使用PM2管理

```bash
# 启动服务
pm install -g pm2
pm run dev
pm run dev

# 查看状态
pm status

# 停止服务
pm stop xiuxian-backend
```

## API接口

### 用户相关

- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息

### 游戏相关

- `GET /api/game/state` - 获取游戏状态
- `POST /api/game/state` - 保存游戏状态
- `GET /api/game/config` - 获取游戏配置
- `GET /api/game/ranking` - 获取排行榜
- `POST /api/game/score` - 提交分数

## 部署

1. 安装依赖：`npm install`
2. 配置环境变量：编辑 `.env` 文件
3. 启动服务：`pm2 start app.js --name xiuxian-backend`
4. 设置开机自启：`pm2 save && pm2 startup`
