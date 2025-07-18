const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../../database.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS chores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        assigned_to INTEGER,
        due_date DATE NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users (id)
      )
    `);

    db.run(`
      INSERT OR IGNORE INTO users (id, name, email) VALUES 
      (1, 'Roni', 'roni@example.com'),
      (2, 'Arad', 'arad@example.com')
    `);

    // Update existing users with new names
    db.run(`
      UPDATE users SET name = 'Roni', email = 'roni@example.com' WHERE id = 1
    `);
    
    db.run(`
      UPDATE users SET name = 'Arad', email = 'arad@example.com' WHERE id = 2
    `);
  });
};

initDatabase();

module.exports = db;