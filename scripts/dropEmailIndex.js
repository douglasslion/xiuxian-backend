/**
 * 删除email索引脚本
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function dropEmailIndex() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('数据库连接成功');
    
    // 获取users集合
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // 查看当前索引
    const indexes = await collection.indexes();
    console.log('当前索引:', indexes);
    
    // 删除email_1索引
    try {
      await collection.dropIndex('email_1');
      console.log('email_1索引删除成功');
    } catch (error) {
      if (error.code === 27) {
        console.log('email_1索引不存在，无需删除');
      } else {
        throw error;
      }
    }
    
    // 查看删除后的索引
    const newIndexes = await collection.indexes();
    console.log('删除后的索引:', newIndexes);
    
    // 关闭连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
    
  } catch (error) {
    console.error('操作失败:', error);
    process.exit(1);
  }
}

dropEmailIndex();