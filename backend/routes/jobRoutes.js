const express = require('express');
const router = express.Router();
const { createJob, getRecruiterJobs, deleteJob, getRecruiterStats, getJobDetails, getJobApplicants, updateJob, getAllJobs, applyForJob, getCandidateApplications, toggleSaveJob, getSavedJobs, getTopJobs, updateApplicationStatus } = require('../controllers/jobController');
const authenticate = require('../middlewares/authMiddleware');

// Public routes
// @route   GET /jobs/top
router.get('/top', getTopJobs);

// All other job routes require authentication
router.use(authenticate);

// @route   GET /jobs/saved
router.get('/saved', getSavedJobs);

// @route   POST /jobs/:id/save
router.post('/:id/save', toggleSaveJob);

// @route   GET /jobs/all
router.get('/all', getAllJobs);

// @route   GET /jobs/applications
router.get('/applications', getCandidateApplications);

// @route   POST /jobs/:id/apply
router.post('/:id/apply', applyForJob);

// @route   POST /jobs
router.post('/', createJob);

// @route   PUT /jobs/:id
router.put('/:id', updateJob);

// @route   GET /jobs/recruiter
router.get('/recruiter', getRecruiterJobs);

// @route   DELETE /jobs/:id
router.delete('/:id', deleteJob);

// @route   GET /jobs/stats
router.get('/stats', getRecruiterStats);

// @route   GET /jobs/:id
router.get('/:id', getJobDetails);

// @route   GET /jobs/:id/applicants
router.get('/:id/applicants', getJobApplicants);

// @route   PUT /jobs/applications/:id/status
router.put('/applications/:id/status', updateApplicationStatus);

module.exports = router;
