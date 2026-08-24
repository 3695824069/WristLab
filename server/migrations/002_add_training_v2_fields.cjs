// Migration 002: Add V2 training fields for structured workout data
// - workout_exercise_records: sets, reps, weight, rpe, rest_seconds
// - workout_records: day_index, notes, started_at, completed_at
module.exports = {
  version: '002',
  description: 'Add V2 training fields (sets/reps/weight/rpe/rest_seconds, day_index/notes/started_at/completed_at)',
  up(db, { exec }) {
    // workout_exercise_records — V2 structured training data
    try { exec('ALTER TABLE workout_exercise_records ADD COLUMN sets INTEGER DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_exercise_records ADD COLUMN reps INTEGER DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_exercise_records ADD COLUMN weight REAL DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_exercise_records ADD COLUMN rpe INTEGER DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_exercise_records ADD COLUMN rest_seconds INTEGER DEFAULT NULL'); } catch (_) {}

    // Indexes for performance
    db.exec('CREATE INDEX IF NOT EXISTS idx_wer_workout ON workout_exercise_records(workout_record_id)');
    db.exec('CREATE INDEX IF NOT EXISTS idx_wer_exercise ON workout_exercise_records(exercise_id)');

    // workout_records — training session metadata
    try { exec('ALTER TABLE workout_records ADD COLUMN day_index INTEGER DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_records ADD COLUMN notes TEXT DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_records ADD COLUMN started_at TEXT DEFAULT NULL'); } catch (_) {}
    try { exec('ALTER TABLE workout_records ADD COLUMN completed_at TEXT DEFAULT NULL'); } catch (_) {}
  },
}
