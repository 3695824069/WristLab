// Migration 003: Add attempts column to sms_codes for login brute-force protection
// - verifyCode counts wrong attempts; after 5 the code is discarded
module.exports = {
  version: '003',
  description: 'Add sms_codes.attempts column (invalidate code after 5 wrong attempts)',
  up(db, { exec }) {
    try { exec('ALTER TABLE sms_codes ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0'); } catch (_) {}
  },
}
