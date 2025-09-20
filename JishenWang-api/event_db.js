const mysql = require('mysql2/promise');

// 数据库连接配置（请修改为你的实际信息！）
const dbConfig = {
  host: 'localhost',
  user: 'root',       // 你的MySQL用户名
  password: '@wjswjs180180.', // 你的MySQL密码（无密码则改为''）
  database: 'charityevents_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 添加连接超时设置（关键！）
  connectTimeout: 10000 // 10秒超时
};

const pool = mysql.createPool(dbConfig);

// 增强的连接测试函数
async function testDbConnection() {
  let connection;
  try {
    console.log('尝试连接数据库...');
    console.log('连接参数:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    // 显式创建连接（而非仅执行查询）
    connection = await pool.getConnection();
    console.log('数据库连接成功！');
    return true;
  } catch (err) {
    // 分类输出常见错误
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('错误：用户名或密码不正确！');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('错误：数据库不存在！请先执行charityevents_db.sql创建数据库');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('错误：连接被拒绝！请检查MySQL服务是否已启动');
    } else {
      console.error('数据库连接错误:', err.code, err.message);
    }
    throw err; // 传递错误，让启动函数捕获
  } finally {
    if (connection) {
      connection.release(); // 释放连接
    }
  }
}

module.exports = { pool, testDbConnection };
