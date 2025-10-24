const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  addDepartment,
  addRegulation,
  addSubject,
  uploadFile,
  deleteFile,
  deleteSubject,
  updateSubjectName,
} = require('../controllers/adminController');

const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

router.post('/login', loginAdmin);


router.post('/department', protect, addDepartment);
router.post('/regulation', protect, addRegulation);
router.post('/subject', protect, addSubject);
router.post('/upload/:subjectId', protect, upload.single('file'), uploadFile);
router.delete('/subject/:id', protect, deleteSubject);
router.delete('/file/:subjectId/:fileUrl', protect, deleteFile);
router.put('/subject/:id', protect, updateSubjectName);



module.exports = router;
