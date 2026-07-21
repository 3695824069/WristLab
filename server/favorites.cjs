const express = require('express');
const { getUserFavorites, toggleFavorite } = require('./db.cjs');
const { requireAuth } = require('./middleware/auth.cjs');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const rows = await getUserFavorites(req.user.userId);
    const favorites = rows.map(r => ({ id: r.item_id, type: r.item_type, title: r.title, thumbnail: r.thumbnail }));
    res.json({ success: true, data: { favorites } });
  } catch (err) {
    console.error('get favorites error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

// POST /api/favorites/toggle — 切换收藏状态（有则删，无则加）
router.post('/toggle', requireAuth, async (req, res) => {
  try {
    const { id, type, title, thumbnail } = req.body;
    if (!id || !type) {
      return res.status(400).json({ success: false, message: '参数不完整' });
    }
    const rows = await toggleFavorite(req.user.userId, id, type, title || '', thumbnail || '');
    const favorites = rows.map(r => ({ id: r.item_id, type: r.item_type, title: r.title, thumbnail: r.thumbnail }));
    res.json({ success: true, data: { favorites } });
  } catch (err) {
    console.error('toggle favorite error:', err);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
});

module.exports = router;
