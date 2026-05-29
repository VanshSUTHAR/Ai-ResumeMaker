const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  generateSummary, generateObjective, generateProjects,
  generateSkills, reviewResume, generateCoverLetter,
  generateInterviewQuestions, generateLinkedInBio, rawPrompt
} = require('../controllers/aiController');

const { tailorResume, extractSkills, quantifyAchievements } = require('../controllers/aiController');

// Allow raw prompt route without auth (useful for frontend dev/testing).
router.post('/raw', rawPrompt);

// Protect other AI routes with auth
router.use(auth);
router.post('/summary', generateSummary);
router.post('/objective', generateObjective);
router.post('/projects', generateProjects);
router.post('/skills', generateSkills);
router.post('/review', reviewResume);
router.post('/tailor', tailorResume);
router.post('/extract-skills', extractSkills);
router.post('/quantify', quantifyAchievements);
router.post('/cover-letter', generateCoverLetter);
router.post('/interview-questions', generateInterviewQuestions);
router.post('/linkedin-bio', generateLinkedInBio);

module.exports = router;
