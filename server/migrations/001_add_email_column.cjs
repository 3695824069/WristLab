// Migration 001: Add email column to users table
// Previously handled by inline try/catch ALTER TABLE in db.cjs
module.exports = {
  version: '001',
  description: 'Add email column and unique index to users table',
  up(db, { exec, queryOne }) {
    // SQLite has no IF NOT EXISTS for ALTER TABLE ADD COLUMN
    // Safe to run on both fresh and existing databases
    try { exec('ALTER TABLE users ADD COLUMN email TEXT'); } catch (_) {}
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL');
  }
};
