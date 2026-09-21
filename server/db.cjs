const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'fit_hub.db');

let db = null;

function getDb() {
  if (db) return db;

  const isNew = !fs.existsSync(DB_PATH);
  db = new Database(DB_PATH);

  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA foreign_keys=ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL UNIQUE,
      nickname TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sms_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS workout_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan_id TEXT DEFAULT '',
      record_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, record_date)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS email_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS workout_exercise_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_record_id INTEGER NOT NULL,
      exercise_id TEXT DEFAULT NULL,
      display_text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (workout_record_id) REFERENCES workout_records(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      item_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      title TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, item_id, item_type)
    )
  `);

  // ─── Migration Framework ───
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_versions (
      version TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gather already-applied versions
  const appliedVersions = new Set();
  const vRows = db.prepare('SELECT version FROM schema_versions ORDER BY version').all();
  for (const row of vRows) appliedVersions.add(row.version);

  // Read and run pending migrations from server/migrations/
  const migrationsDir = path.join(__dirname, 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => /^\d{3}_.+\.cjs$/.test(f))
      .sort();

    for (const file of files) {
      const version = file.split('_')[0];
      if (appliedVersions.has(version)) continue;

      const migration = require(path.join(migrationsDir, file));
      console.log(`[migration] applying ${file}...`);
      try {
        migration.up(db, { exec, queryOne });
        db.prepare('INSERT INTO schema_versions (version, description) VALUES (?, ?)').run(version, migration.description);
        console.log(`[migration] ${file} applied`);
      } catch (err) {
        console.error(`[migration] ${file} FAILED:`, err.message);
        throw err;
      }
    }
  }

  return db;
}

// Kept as noop for backward compatibility (better-sqlite3 auto-persists)
function saveDb() {}

// Kept as noop for backward compatibility
function scheduleSave() {}

// Helper: execute single-row query, returns object or null
function queryOne(sql, params = []) {
  return db.prepare(sql).get(...params) ?? null;
}

// Helper: execute write query (INSERT/UPDATE/DELETE)
function execute(sql, params = []) {
  db.prepare(sql).run(...params);
}

// --- User operations ---

function findOrCreateUser(phone) {
  getDb();
  let user = queryOne('SELECT * FROM users WHERE phone = ?', [phone]);
  if (!user) {
    execute('INSERT INTO users (phone) VALUES (?)', [phone]);
    user = queryOne('SELECT * FROM users WHERE phone = ?', [phone]);
  }
  return user;
}

function getUser(id) {
  getDb();
  return queryOne('SELECT * FROM users WHERE id = ?', [id]);
}

function updateUser(id, fields) {
  getDb();
  const sets = [];
  const vals = [];
  for (const [key, val] of Object.entries(fields)) {
    if (val !== undefined) {
      sets.push(`${key} = ?`);
      vals.push(val);
    }
  }
  if (sets.length === 0) return;
  sets.push('updated_at = CURRENT_TIMESTAMP');
  vals.push(id);
  execute(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals);
  return getUser(id);
}

// --- SMS Code operations ---

function saveCode(phone, code, expiresAt) {
  getDb();
  execute('INSERT INTO sms_codes (phone, code, expires_at) VALUES (?, ?, ?)', [phone, code, expiresAt]);
}

function verifyCode(phone, code) {
  getDb();
  const row = queryOne(
    `SELECT * FROM sms_codes
     WHERE phone = ? AND code = ? AND used = 0 AND strftime('%s', expires_at) > strftime('%s', 'now')
     ORDER BY id DESC LIMIT 1`,
    [phone, code]
  );
  if (row) {
    execute('UPDATE sms_codes SET used = 1 WHERE id = ?', [row.id]);
    return true;
  }

  // Wrong code: count the attempt against the phone's latest unused code.
  // After 5 wrong attempts the code is discarded (user must re-request).
  const latest = queryOne(
    `SELECT id, attempts FROM sms_codes
     WHERE phone = ? AND used = 0 AND strftime('%s', expires_at) > strftime('%s', 'now')
     ORDER BY id DESC LIMIT 1`,
    [phone]
  );
  if (latest) {
    const attempts = (latest.attempts || 0) + 1;
    if (attempts >= 5) {
      execute('UPDATE sms_codes SET used = 1, attempts = ? WHERE id = ?', [attempts, latest.id]);
    } else {
      execute('UPDATE sms_codes SET attempts = ? WHERE id = ?', [attempts, latest.id]);
    }
  }
  return false;
}

// --- Workout Record operations ---

/** Local-timezone YYYY-MM-DD. Avoids toISOString() (UTC) off-by-one for UTC+8 users. */
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Create a workout record (check-in).
 * Accepts both V1 (completedExercises) and V2 (exercises with sets/reps/weight/rpe) formats.
 *
 * @param {number} userId
 * @param {string} planId
 * @param {Array} exercises - V1: [{ exerciseId, displayText }] or V2: [{ exerciseId, displayText, sets, reps, weight, rpe }]
 * @param {object} [options] - V2 session metadata
 * @param {number} [options.dayIndex]
 * @param {string} [options.notes]
 * @param {string} [options.startedAt]
 * @param {string} [options.completedAt]
 * @returns {object|null} { recordId, today } or null if already checked in today
 */
function createWorkoutRecord(userId, planId = '', exercises = [], options = {}) {
  getDb();
  const today = localDateStr(new Date());
  try {
    // Single transaction: record + exercise rows are atomic (no orphan records).
    // UNIQUE(user_id, record_date) throws inside the transaction on duplicate,
    // which rolls back and is caught below → returns null → 409.
    let recordId;
    transaction(() => {
      // Insert record with optional V2 metadata fields
      const recordCols = ['user_id', 'plan_id', 'record_date'];
      const recordVals = [userId, planId, today];

      if (options.dayIndex != null) {
        recordCols.push('day_index');
        recordVals.push(options.dayIndex);
      }
      if (options.notes != null) {
        recordCols.push('notes');
        recordVals.push(options.notes);
      }
      if (options.startedAt != null) {
        recordCols.push('started_at');
        recordVals.push(options.startedAt);
      }
      if (options.completedAt != null) {
        recordCols.push('completed_at');
        recordVals.push(options.completedAt);
      }

      execute(
        `INSERT INTO workout_records (${recordCols.join(', ')}) VALUES (${recordCols.map(() => '?').join(', ')})`,
        recordVals
      );
      recordId = queryOne('SELECT last_insert_rowid() as id').id;

      if (exercises && exercises.length > 0) {
        const now = new Date().toISOString();
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i];

          // Detect V2 format: has structured fields beyond exerciseId/displayText
          const isV2 = ex.sets != null || ex.reps != null || ex.weight != null || ex.rpe != null;

          if (isV2) {
            execute(
              `INSERT INTO workout_exercise_records
               (workout_record_id, exercise_id, display_text, completed, completed_at, sort_order,
                sets, reps, weight, rpe)
               VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
              [
                recordId,
                ex.exerciseId || null,
                ex.displayText,
                now,
                i,
                ex.sets != null ? ex.sets : null,
                ex.reps != null ? ex.reps : null,
                ex.weight != null ? ex.weight : null,
                ex.rpe != null ? ex.rpe : null,
              ]
            );
          } else {
            // V1 format: backward compatible
            execute(
              `INSERT INTO workout_exercise_records
               (workout_record_id, exercise_id, display_text, completed, completed_at, sort_order)
               VALUES (?, ?, ?, 1, ?, ?)`,
              [recordId, ex.exerciseId || null, ex.displayText, now, i]
            );
          }
        }
      }
    });
    return { recordId, today };
  } catch (err) {
    // UNIQUE constraint — already checked in today (or any insert failure: rolled back)
    return null;
  }
}

function getWorkoutRecords(userId, limit = 30) {
  getDb();
  const rows = db.prepare(
    'SELECT * FROM workout_records WHERE user_id = ? ORDER BY record_date DESC LIMIT ?'
  ).all(userId, limit);

  // Load exercise details for each record
  for (const row of rows) {
    row.exercises = db.prepare(
      'SELECT * FROM workout_exercise_records WHERE workout_record_id = ? ORDER BY sort_order'
    ).all(row.id);
  }

  return rows;
}

/**
 * Get weekly training counts for the past N weeks.
 * Returns array of { week_start: string (Monday), count: number }.
 */
function getWorkoutTrends(userId, weeks = 12) {
  getDb();
  const rows = db.prepare(
    'SELECT record_date FROM workout_records WHERE user_id = ? ORDER BY record_date'
  ).all(userId);

  // Build a map of date → count
  const dateCount = {};
  for (const r of rows) {
    dateCount[r.record_date] = (dateCount[r.record_date] || 0) + 1;
  }

  // Walk backward from last Monday, weeks at a time
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + mondayOffset);
  thisMonday.setHours(0, 0, 0, 0);

  const result = [];
  for (let w = 0; w < weeks; w++) {
    const mon = new Date(thisMonday);
    mon.setDate(mon.getDate() - w * 7);
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);

    // Format YYYY-MM-DD (local timezone — matches record_date written at checkin)
    const monStr = localDateStr(mon);
    const sunStr = localDateStr(sun);

    let count = 0;
    // Sum counts for each day in this week
    const cursor = new Date(mon);
    while (cursor <= sun) {
      const d = localDateStr(cursor);
      if (dateCount[d]) count += dateCount[d];
      cursor.setDate(cursor.getDate() + 1);
    }

    result.push({ week_start: monStr, count });
  }

  return result.reverse(); // oldest first
}

function getWorkoutStats(userId) {
  getDb();
  const rows = getWorkoutRecords(userId, 365);
  const total = rows.length;

  // Weekly count: current natural week (Mon-Sun)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const mondayStr = localDateStr(monday);

  let weekCount = 0;
  for (const r of rows) {
    if (r.record_date >= mondayStr) weekCount++;
  }

  // Streak: consecutive days counting backward from today
  let streak = 0;
  const checkedDates = new Set(rows.map(r => r.record_date));
  const cursor = new Date(now);
  // If today not checked, start from yesterday
  const todayStr = now.toISOString().split('T')[0];
  if (!checkedDates.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (true) {
    const d = cursor.toISOString().split('T')[0];
    if (checkedDates.has(d)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const checkedToday = rows.length > 0 && rows[0].record_date === todayStr;

  return { total, weekCount, streak, checkedToday };
}

// --- Transaction helper (for bind-email atomicity) ---

function exec(sql, params = []) {
  db.prepare(sql).run(...params);
}

function transaction(fn) {
  const wrapped = db.transaction(fn);
  wrapped();
}

// --- Email operations ---

function getUserByEmail(email) {
  getDb();
  return queryOne('SELECT * FROM users WHERE email = ?', [email]);
}

function updateUserEmail(userId, email) {
  getDb();
  execute('UPDATE users SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [email, userId]);
  return getUser(userId);
}

function saveEmailCode(email, code, expiresAt, createdAt) {
  getDb();
  execute(
    'INSERT INTO email_codes (email, code, expires_at, used, created_at) VALUES (?, ?, ?, 0, ?)',
    [email, code, expiresAt, createdAt]
  );
}

function getLatestUnusedCode(email) {
  getDb();
  return queryOne(
    'SELECT * FROM email_codes WHERE email = ? AND used = 0 ORDER BY id DESC LIMIT 1',
    [email]
  );
}

function markCodeUsed(id) {
  getDb();
  execute('UPDATE email_codes SET used = 1 WHERE id = ?', [id]);
}

function invalidateEmailCodes(email) {
  getDb();
  execute('UPDATE email_codes SET used = 1 WHERE email = ? AND used = 0', [email]);
}

// --- Favorites operations ---

function getUserFavorites(userId) {
  getDb();
  return db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

function toggleFavorite(userId, itemId, itemType, title, thumbnail) {
  getDb();
  const existing = queryOne(
    'SELECT id FROM favorites WHERE user_id = ? AND item_id = ? AND item_type = ?',
    [userId, itemId, itemType]
  );
  if (existing) {
    execute('DELETE FROM favorites WHERE id = ?', [existing.id]);
  } else {
    execute(
      'INSERT INTO favorites (user_id, item_id, item_type, title, thumbnail) VALUES (?, ?, ?, ?, ?)',
      [userId, itemId, itemType, title, thumbnail]
    );
  }
  return getUserFavorites(userId);
}

module.exports = { getDb, saveDb, findOrCreateUser, getUser, updateUser, saveCode, verifyCode, createWorkoutRecord, getWorkoutRecords, getWorkoutStats, getWorkoutTrends, exec, queryOne, transaction, getUserByEmail, updateUserEmail, saveEmailCode, getLatestUnusedCode, markCodeUsed, invalidateEmailCodes, getUserFavorites, toggleFavorite };
