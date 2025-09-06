const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const { name, avatarUrl } = req.body;
    user.name = name || user.name;
    user.avatarUrl = avatarUrl || user.avatarUrl;
    await user.save();
    res.json({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};
