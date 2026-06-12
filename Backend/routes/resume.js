const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getResumes, getResume, createResume, updateResume, deleteResume
} = require('../controllers/resumeController');

router.use(auth);
router.get('/', getResumes);
router.get('/all', getResumes);
router.get('/:id', getResume);
router.post('/', createResume);
router.post('/create', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);



module.exports = router;
