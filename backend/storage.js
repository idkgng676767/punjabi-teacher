const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'state.sqlite');
const legacyStateFile = path.join(dataDir, 'state.json');

let database = null;

function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function getDatabase() {
  ensureStorage();

  if (!database) {
    database = new DatabaseSync(dbFile);
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);
  }

  return database;
}

function readLegacyState() {
  if (!fs.existsSync(legacyStateFile)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(legacyStateFile, 'utf8');
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      userIdCounter: Number.isInteger(parsed.userIdCounter) ? parsed.userIdCounter : 1,
    };
  } catch (error) {
    console.warn('Failed to read legacy JSON state, starting with the SQLite store:', error.message);
    return null;
  }
}

function writeStateToDatabase(state) {
  const db = getDatabase();
  const users = Array.isArray(state.users) ? state.users : [];
  const userIdCounter = Number.isInteger(state.userIdCounter) ? state.userIdCounter : 1;
  const insertUser = db.prepare('INSERT INTO users (id, data) VALUES (?, ?)');
  const insertMeta = db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)');

  db.exec('BEGIN IMMEDIATE');

  try {
    db.exec('DELETE FROM users; DELETE FROM meta;');

    for (const user of users) {
      insertUser.run(Number(user.id), JSON.stringify(user));
    }

    insertMeta.run('userIdCounter', String(userIdCounter));
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function loadState() {
  const db = getDatabase();
  const userRows = db.prepare('SELECT data FROM users ORDER BY id ASC').all();

  if (userRows.length === 0) {
    const legacyState = readLegacyState();

    if (legacyState) {
      writeStateToDatabase(legacyState);
      return legacyState;
    }
  }

  const users = userRows.map((row) => JSON.parse(row.data));
  const counterRow = db.prepare('SELECT value FROM meta WHERE key = ?').get('userIdCounter');
  const derivedCounter = users.reduce((highestId, user) => Math.max(highestId, Number(user.id) || 0), 0) + 1;

  return {
    users,
    userIdCounter: counterRow ? Number(counterRow.value) : derivedCounter,
  };
}

function persistState(state) {
  writeStateToDatabase(state);
}

module.exports = { loadState, persistState };