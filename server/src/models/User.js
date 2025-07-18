const db = require('./database');

class User {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY name ASC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(userData) {
    return new Promise((resolve, reject) => {
      const { name, email } = userData;
      const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
      db.run(query, [name, email], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...userData });
      });
    });
  }
}

module.exports = User;