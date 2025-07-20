const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ensureAdmin = require('./setup/adminUser');

// Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const statsController = require('./controllers/statsController');

// DB
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

ensureAdmin();

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);

// Basic stats endpoint for post/user count
const db = require('./config/db');
app.get('/stats', async (req, res) => {
  try {
    db.query('SELECT COUNT(*) AS post_count FROM posts', (err1, posts) => {
      if (err1) throw err1;
      db.query('SELECT COUNT(*) AS user_count FROM users', (err2, users) => {
        if (err2) throw err2;
        res.json({
          post_count: posts[0].post_count,
          user_count: users[0].user_count
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/stats/likes-average', statsController.getLikesAverage);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));