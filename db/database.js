const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./payments.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT,
      amount INTEGER,
      status TEXT
    )
  `);
});

module.exports = db;
