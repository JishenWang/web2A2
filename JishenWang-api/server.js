const express = require('express');
const cors = require('cors');
const { pool, testDbConnection } = require('./event_db');

const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(cors());

// 全局未捕获错误处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err.message);
  console.error('错误堆栈:', err.stack);
  process.exit(1); // 退出进程
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 接口定义（保持不变）
app.get('/api/events/home', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.id
      WHERE e.is_active = TRUE AND e.event_date > ?
      ORDER BY e.event_date ASC
    `, [currentDate]);

    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: '获取首页事件失败：' + err.message });
  }
});

app.get('/api/events/search', async (req, res) => {
  try {
    const { startDate, endDate, location, categoryId } = req.query;
    let query = `
      SELECT e.*, c.name AS category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.id
      WHERE e.is_active = TRUE AND e.event_date > NOW()
    `;
    const params = [];

    if (startDate) {
      query += ' AND e.event_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND e.event_date <= ?';
      params.push(endDate);
    }
    if (location) {
      query += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }

    const [events] = await pool.query(query, params);
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: '搜索事件失败：' + err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `, [eventId]);

    if (events.length === 0) {
      return res.status(404).json({ success: false, error: '未找到该事件' });
    }

    res.status(200).json({ success: true, data: events[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: '获取事件详情失败：' + err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: '获取分类失败：' + err.message });
  }
});

// 启动服务（修改为更健壮的方式）
async function startServer() {
  try {
    console.log('正在测试数据库连接...');
    await testDbConnection(); // 显式等待连接测试完成
    
    app.listen(PORT, () => {
      console.log(`API服务已启动，访问地址：http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('启动服务失败:', err.message);
    process.exit(1);
  }
}

// 调用启动函数
startServer();
