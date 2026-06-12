const Resume = require('../models/Resume');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

const mockCacheDir = path.join(__dirname, '../../.cache');
const mockResumesFile = path.join(mockCacheDir, 'mock_resumes.json');

const getMockResumes = () => {
  try {
    if (!fs.existsSync(mockCacheDir)) {
      fs.mkdirSync(mockCacheDir, { recursive: true });
    }
    if (fs.existsSync(mockResumesFile)) {
      return JSON.parse(fs.readFileSync(mockResumesFile, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading mock resumes:', err);
  }
  return [];
};

const saveMockResumes = (resumes) => {
  try {
    if (!fs.existsSync(mockCacheDir)) {
      fs.mkdirSync(mockCacheDir, { recursive: true });
    }
    fs.writeFileSync(mockResumesFile, JSON.stringify(resumes, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving mock resumes:', err);
  }
};

exports.getResumes = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const resumes = await Resume.find({ userId: req.user._id || req.user.id }).sort({ updatedAt: -1 });
      res.json(resumes);
    } else {
      const mockResumes = getMockResumes();
      const userIdStr = (req.user._id || req.user.id || '').toString();
      const userResumes = mockResumes.filter(r => r.userId.toString() === userIdStr);
      res.json(userResumes);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id || req.user.id });
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      res.json(resume);
    } else {
      const mockResumes = getMockResumes();
      const resume = mockResumes.find(r => r._id.toString() === req.params.id && r.userId.toString() === (req.user._id || req.user.id).toString());
      if (!resume) return res.status(404).json({ message: 'Resume not found (In-Memory)' });
      res.json(resume);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createResume = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const resume = await Resume.create({ ...req.body, userId: req.user._id || req.user.id });
      res.status(201).json(resume);
    } else {
      const mockResumes = getMockResumes();
      const mockId = new mongoose.Types.ObjectId();
      const resume = {
        _id: mockId,
        id: mockId.toString(),
        userId: req.user._id || req.user.id,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockResumes.push(resume);
      saveMockResumes(mockResumes);
      res.status(201).json(resume);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const resume = await Resume.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id || req.user.id },
        { ...req.body, updatedAt: Date.now() },
        { new: true }
      );
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      res.json(resume);
    } else {
      const mockResumes = getMockResumes();
      const index = mockResumes.findIndex(r => r._id.toString() === req.params.id && r.userId.toString() === (req.user._id || req.user.id).toString());
      if (index === -1) return res.status(404).json({ message: 'Resume not found (In-Memory)' });
      
      mockResumes[index] = {
        ...mockResumes[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      saveMockResumes(mockResumes);
      res.json(mockResumes[index]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id || req.user.id });
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      res.json({ message: 'Resume deleted' });
    } else {
      const mockResumes = getMockResumes();
      const index = mockResumes.findIndex(r => r._id.toString() === req.params.id && r.userId.toString() === (req.user._id || req.user.id).toString());
      if (index === -1) return res.status(404).json({ message: 'Resume not found (In-Memory)' });
      mockResumes.splice(index, 1);
      saveMockResumes(mockResumes);
      res.json({ message: 'Resume deleted (In-Memory)' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

