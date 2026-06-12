import api from './api';

const aiService = {
  generateSummary: async (name, skills, experience, role) => {
    const response = await api.post('/ai/generate-summary', { name, skills, experience, role });
    return response.data.result;
  },

  improveResume: async (section, text, jobTitle) => {
    const response = await api.post('/ai/improve-resume', { section, text, jobTitle });
    return response.data.result;
  },

  checkAtsScore: async (resumeData, jobDescription, resumeText = '') => {
    const response = await api.post('/ai/ats-score', { resumeData, jobDescription, resumeText });
    return response.data; // Returns { atsScore, improvements[], missingKeywords[], formatting[] }
  },

  extractResume: async (resumeText) => {
    const response = await api.post('/ai/extract-resume', { resumeText });
    return response.data;
  }
};

export default aiService;
