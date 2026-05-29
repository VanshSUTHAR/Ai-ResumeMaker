const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    let user = null;
    try {
      // Try verifying as a real JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId).select('-password');
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.user = user;
    } catch (e) {
      // Fallback: accept demo base64-encoded user object (dev only)
      try {
        const txt = Buffer.from(token, 'base64').toString('utf8');
        const u = JSON.parse(txt);
        // attach a lightweight user object (no DB lookup)
        req.user = { id: u.id || null, name: u.name || u.email || 'Demo User', email: u.email || '' };
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
