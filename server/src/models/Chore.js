const db = require('./database');

class Chore {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT chores.*, users.name as assigned_to_name 
        FROM chores 
        LEFT JOIN users ON chores.assigned_to = users.id
        ORDER BY chores.due_date ASC, chores.created_at DESC
      `;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT chores.*, users.name as assigned_to_name 
        FROM chores 
        LEFT JOIN users ON chores.assigned_to = users.id
        WHERE chores.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(choreData) {
    return new Promise((resolve, reject) => {
      const { title, description, assigned_to, due_date, priority } = choreData;
      const query = `
        INSERT INTO chores (title, description, assigned_to, due_date, priority)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [title, description, assigned_to, due_date, priority], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...choreData });
      });
    });
  }

  static update(id, choreData) {
    return new Promise((resolve, reject) => {
      const { title, description, assigned_to, due_date, status, priority } = choreData;
      const query = `
        UPDATE chores 
        SET title = ?, description = ?, assigned_to = ?, due_date = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      db.run(query, [title, description, assigned_to, due_date, status, priority, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ...choreData });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM chores WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: this.changes > 0 });
      });
    });
  }
}

module.exports = Chore;