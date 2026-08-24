const express = require('express');
const { createWorkoutRecord, getWorkoutRecords, getWorkoutStats, getWorkoutTrends } = require('./db.cjs');
const { requireAuth } = require('./middleware/auth.cjs');

const router = express.Router();

// JWT auth middleware
router.post('/checkin', requireAuth, async (req, res) => {
  try {
    const { plan_id, completedExercises, exercises, day_index, notes, started_at, completed_at } = req.body;

    // V2 format: 'exercises' takes precedence; fall back to 'completedExercises' for backward compat
    const exerciseData = exercises || completedExercises || [];

    const result = await createWorkoutRecord(
      req.user.userId,
      plan_id || '',
      exerciseData,
      { dayIndex: day_index, notes, startedAt: started_at, completedAt: completed_at }
    );
    if (result) {
      // Reload the full record with exercises
      const records = await getWorkoutRecords(req.user.userId, 1);
      const record = records[0] || result;
      res.json({ success: true, message: '打卡成功', data: { record } });
    } else {
      res.status(409).json({ success: false, message: '今天已经打卡过了', code: 'ALREADY_CHECKED_IN' });
    }
  } catch (err) {
    console.error('checkin error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/workouts/history — 训练历史
router.get('/history', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 365);
    const records = await getWorkoutRecords(req.user.userId, limit);
    res.json({ success: true, data: { records } });
  } catch (err) {
    console.error('history error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/workouts/stats — 训练统计
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await getWorkoutStats(req.user.userId);
    res.json({ success: true, data: { stats } });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/workouts/trends — 每周训练趋势
router.get('/trends', requireAuth, async (req, res) => {
  try {
    const weeks = Math.min(parseInt(req.query.weeks) || 12, 52);
    const trends = await getWorkoutTrends(req.user.userId, weeks);
    res.json({ success: true, data: { trends } });
  } catch (err) {
    console.error('trends error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// GET /api/workouts/today — 今日推荐训练
router.get('/today', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const records = await getWorkoutRecords(userId, 365);

    const todayStr = new Date().toISOString().split('T')[0];
    const checkedToday = records.length > 0 && records[0].record_date === todayStr;

    let planId = 'plan-7day'; // default: 7天全身激活计划
    let dayIndex = 1;          // default: Day 1

    if (records.length > 0) {
      // 使用最近一次训练关联的计划
      for (const r of records) {
        if (r.plan_id && r.plan_id !== '') {
          planId = r.plan_id;
          break;
        }
      }
      // dayIndex = streak + 1（按计划实际天数封顶）
      const planDays = parseInt(planId.replace('plan-', ''), 10) || 7;
      const stats = await getWorkoutStats(userId);
      dayIndex = Math.min(stats.streak + 1, planDays);
    }

    res.json({ success: true, data: { planId, dayIndex, checkedToday } });
  } catch (err) {
    console.error('today error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

module.exports = router;
