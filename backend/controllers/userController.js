const User = require('../models/userModel');

exports.getProfile = (req, res) => {
  User.findById(req.params.id, (err, results) => {
    if (err || !results) return res.sendStatus(404);
    res.json(results);
  });
};

exports.updateProfile = (req, res) => {
  const id = parseInt(req.params.id);
  if (id !== req.user.id) return res.sendStatus(403);

  const { first_name, last_name, middle_name, email } = req.body;
  User.updateProfile(id, { first_name, last_name, middle_name, email }, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Profile updated' });
  });
};

exports.deleteProfile = (req, res) => {
  const id = parseInt(req.params.id);
  if (id !== req.user.id) return res.sendStatus(403);

  User.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Account deleted' });
  });
};

exports.getSettings = (req, res) => {
  const userId = req.params.id;
  User.getSettings(userId, (err, settings) => {
    if (err || !settings) return res.status(404).json({ message: 'Not found' });
    res.json(settings[0]);
  });
};

exports.updateSettings = (req, res) => {
  const userId = req.params.id;
  const { theme_preference, acknowledged } = req.body;
  const ip = req.ip;

  User.updateSettings(userId, theme_preference, acknowledged, ip, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Settings updated' });
  });
};