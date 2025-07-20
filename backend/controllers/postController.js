const Post = require('../models/postModel');

const AUTO_APPROVE = process.env.AUTO_APPROVE === 'true';

exports.getPosts = (req, res) => {
  const { sort, order, search, from, to, limit, offset } = req.query;
  Post.getApprovedPosts({ sort, order, search, from, to, limit, offset }, (err, posts) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(posts);
  });
};

exports.createPost = (req, res) => {
  const { title, content, scheduled_at, categoryId } = req.body;
  const userId = req.user.id;
  const approved = AUTO_APPROVE ? 1 : 0;

  Post.create({
    title,
    content,
    createdBy: userId,
    categoryId,
    scheduledAt: scheduled_at,
    approved
  }, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ id: result.insertId });
  });
};

exports.updatePost = (req, res) => {
  const { title, content, scheduled_at, categoryId } = req.body;
  const userId = req.user.id;
  Post.findById(req.params.id, (err, post) => {
    if (err || !post) return res.sendStatus(404);
    if (post.created_by !== userId && !req.user.is_admin) return res.sendStatus(403);

    Post.update(req.params.id, { title, content, updatedBy: userId, categoryId, scheduledAt: scheduled_at }, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Post updated' });
    });
  });
};

exports.deletePost = (req, res) => {
  const userId = req.user.id;
  Post.findById(req.params.id, (err, post) => {
    if (err || !post) return res.sendStatus(404);
    if (post.created_by !== userId && !req.user.is_admin) return res.sendStatus(403);

    Post.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Post deleted' });
    });
  });
};

exports.likePost = (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  Post.alreadyLiked(userId, postId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (rows.length > 0) return res.status(400).json({ message: 'Already liked' });

    Post.recordLike(userId, postId, (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      Post.incrementLikes(postId, (err) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Post liked' });
      });
    });
  });
};

exports.getPendingPosts = (req, res) => {
  Post.getPending((err, posts) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(posts);
  });
};

exports.approvePost = (req, res) => {
  Post.approve(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Post approved' });
  });
};

exports.rejectPost = (req, res) => {
  Post.reject(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Post rejected' });
  });
};