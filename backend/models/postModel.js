const db = require('../config/db');

const PostModel = {
  getApprovedPosts({ sort = 'created_at', order = 'desc', search = '', category, from, to, limit = 20, offset = 0 }, callback) {
    const allowedSort = ['title', 'created_at', 'likes'];
    const allowedOrder = ['asc', 'desc'];
    if (!allowedSort.includes(sort)) sort = 'created_at';
    if (!allowedOrder.includes(order)) order = 'desc';

    let conditions = `posts.approved = 1 AND posts.title LIKE ?`;
    let params = [`%${search}%`];

    if (category) {
      conditions += ' AND categories.name = ?';
      params.push(category);
    }

    if (from) {
      conditions += ' AND posts.created_at >= ?';
      params.push(from);
    }

    if (to) {
      conditions += ' AND posts.created_at <= ?';
      params.push(to);
    }

    const sql = `
      SELECT posts.*, u.username AS createdBy, c.name AS categoryName
      FROM posts
      LEFT JOIN users u ON posts.created_by = u.id
      LEFT JOIN categories c ON posts.category_id = c.id
      WHERE ${conditions}
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    params.push(parseInt(limit));
    params.push(parseInt(offset));

    db.query(sql, params, callback);
  },

  create({ title, content, createdBy, categoryId, scheduledAt, approved }, callback) {
    const sql = scheduledAt
      ? 'INSERT INTO posts (title, content, created_by, updated_by, category_id, scheduled_at, approved) VALUES (?, ?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO posts (title, content, created_by, updated_by, category_id, approved) VALUES (?, ?, ?, ?, ?, ?)';

    const params = scheduledAt
      ? [title, content, createdBy, createdBy, categoryId, scheduledAt, approved]
      : [title, content, createdBy, createdBy, categoryId, approved];

    db.query(sql, params, callback);
  },

  update(postId, { title, content, updatedBy, categoryId, scheduledAt }, callback) {
    db.query(
      'UPDATE posts SET title = ?, content = ?, updated_by = ?, category_id = ?, scheduled_at = ? WHERE id = ?',
      [title, content, updatedBy, categoryId, scheduledAt, postId],
      callback
    );
  },

  delete(postId, callback) {
    db.query('DELETE FROM posts WHERE id = ?', [postId], callback);
  },

  findById(postId, callback) {
    db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  incrementLikes(postId, callback) {
    db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], callback);
  },

  alreadyLiked(userId, postId, callback) {
    db.query('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?', [userId, postId], callback);
  },

  recordLike(userId, postId, callback) {
    db.query('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)', [userId, postId], callback);
  },

  approve(postId, callback) {
    db.query('UPDATE posts SET approved = 1 WHERE id = ?', [postId], callback);
  },

  reject(postId, callback) {
    db.query('DELETE FROM posts WHERE id = ?', [postId], callback);
  },

  getPostCount(callback) {
    db.query('SELECT COUNT(*) AS count FROM posts', callback);
  },

  getPending(callback) {
    const sql = `
      SELECT posts.*, u.username AS createdBy, c.name AS categoryName
      FROM posts
      LEFT JOIN users u ON posts.created_by = u.id
      LEFT JOIN categories c ON posts.category_id = c.id
      WHERE posts.approved = 0
      ORDER BY posts.created_at DESC
    `;
    db.query(sql, callback);
  }
};

module.exports = PostModel;