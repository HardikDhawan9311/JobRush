const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProfile, updateProfile, getCandidateProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  }
});

// Routes
router.get('/profile', authMiddleware, getProfile);
router.get('/profile/:id', authMiddleware, getCandidateProfile);
router.put('/profile', authMiddleware, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'resume_url', maxCount: 1 },
  { name: 'company_logo', maxCount: 1 }
]), updateProfile);

module.exports = router;
