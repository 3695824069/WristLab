const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const authRouter = require('./auth.cjs');
const workoutsRouter = require('./workouts.cjs');
const favoritesRouter = require('./favorites.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',').filter(Boolean) || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/favorites', favoritesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`WristLab API server running on http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  POST /api/auth/send-code       - 发送验证码`);
  console.log(`  POST /api/auth/send-email-code  - 发送邮箱验证码`);
  console.log(`  POST /api/auth/login           - 验证码登录`);
  console.log(`  POST /api/auth/bind-email      - 绑定邮箱`);
  console.log(`  POST /api/auth/unbind-email    - 解绑邮箱`);
  console.log(`  GET  /api/auth/me              - 获取当前用户`);
  console.log(`  PUT  /api/auth/profile         - 更新个人资料`);
  console.log(`  POST /api/workouts/checkin     - 训练打卡`);
  console.log(`  GET  /api/workouts/history     - 训练历史`);
  console.log(`  GET  /api/workouts/stats       - 训练统计`);
  console.log(`  GET  /api/workouts/today       - 今日推荐训练`);
  console.log(`  GET  /api/health               - 健康检查`);
});
