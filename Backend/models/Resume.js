const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  template: { type: String, enum: ['modern', 'professional', 'minimal', 'creative', 'classic'], default: 'modern' },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String,
    summary: String
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    points: [String]
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    techStack: [String],
    liveUrl: String,
    githubUrl: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    url: String
  }],
  achievements: [String],
  languages: [{ language: String, proficiency: String }],
  atsScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ResumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', ResumeSchema);
