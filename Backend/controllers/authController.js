const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const fs = require('fs');
const path = require('path');

const mockCacheDir = path.join(__dirname, '../../.cache');
const mockUsersFile = path.join(mockCacheDir, 'mock_users.json');

const getMockUsers = () => {
  try {
    if (!fs.existsSync(mockCacheDir)) {
      fs.mkdirSync(mockCacheDir, { recursive: true });
    }
    if (fs.existsSync(mockUsersFile)) {
      return JSON.parse(fs.readFileSync(mockUsersFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading mock users:', err);
  }
  return [];
};

const saveMockUsers = (users) => {
  try {
    if (!fs.existsSync(mockCacheDir)) {
      fs.mkdirSync(mockCacheDir, { recursive: true });
    }
    fs.writeFileSync(mockUsersFile, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving mock users:', err);
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ message: 'Email already registered' });
      const user = await User.create({ name, email, password });
      const token = generateToken(user._id);
      return res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Fallback in-memory
      console.warn("MongoDB is not connected. Falling back to in-memory registration.");
      const mockUsers = getMockUsers();
      const existing = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing)
        return res.status(400).json({ message: 'Email already registered (In-Memory)' });
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const mockId = new mongoose.Types.ObjectId();
      const user = {
        _id: mockId,
        id: mockId.toString(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      };
      mockUsers.push(user);
      saveMockUsers(mockUsers);
      const token = generateToken(user.id);
      return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken(user._id);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email }
      });
    } else {
      // Fallback in-memory
      console.warn("MongoDB is not connected. Falling back to in-memory login.");
      const mockUsers = getMockUsers();
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Invalid credentials (In-Memory)' });
      const token = generateToken(user.id);
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: { id: req.user.id || req.user._id, name: req.user.name, email: req.user.email } });
};
