const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { 
      title, 
      company_name, 
      location, 
      salary_min, 
      salary_max, 
      job_type, 
      experience_level, 
      category, 
      skills_required, 
      description,
      openings
    } = req.body;

    const recruiter_id = req.user.id;

    const [result] = await db.query(
      `INSERT INTO jobs (
        recruiter_id, title, company_name, location, salary_min, salary_max, 
        job_type, experience_level, category, skills_required, description, openings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recruiter_id, title, company_name, location, salary_min, salary_max, 
        job_type, experience_level, category, skills_required, description, openings || 1
      ]
    );

    const jobId = result.insertId;

    // Skill Matching Notification System (Asynchronous)
    (async () => {
      try {
        const requiredSkillsArr = skills_required.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        if (requiredSkillsArr.length === 0) return;

        const [candidates] = await db.query('SELECT email, full_name, skills FROM users WHERE role = "candidate" AND skills IS NOT NULL');
        
        for (const candidate of candidates) {
          const candidateSkillsArr = candidate.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
          
          // Calculate Match %
          const matches = requiredSkillsArr.filter(skill => candidateSkillsArr.includes(skill));
          const matchPercentage = (matches.length / requiredSkillsArr.length) * 100;

          if (matchPercentage >= 50) {
            await sendEmail({
              email: candidate.email,
              subject: `Job Match Found: ${title} at ${company_name}`,
              message: `Hi ${candidate.full_name},\n\nWe found a job that perfectly matches your skill set!\n\nPosition: ${title}\nCompany: ${company_name}\nLocation: ${location}\nSkills Match: ${Math.round(matchPercentage)}%\n\nApply now to this position on JobRush: http://localhost:5173/jobs/${jobId}\n\nBest of luck!\nTeam JobRush`
            });
          }
        }
      } catch (matchErr) {
        console.error('Skill matching error:', matchErr);
      }
    })();

    res.status(201).json({ message: 'Job posted successfully', jobId });
  } catch (err) {
    console.error('Create Job Error:', err);
    res.status(500).json({ message: 'Server error creating job' });
  }
};

// Get all jobs for a recruiter
exports.getRecruiterJobs = async (req, res) => {
  try {
    const recruiter_id = req.user.id;
    const [jobs] = await db.query(
      'SELECT * FROM jobs WHERE recruiter_id = ? ORDER BY posted_at DESC',
      [recruiter_id]
    );
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Get Jobs Error:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiter_id = req.user.id;

    const [result] = await db.query(
      'DELETE FROM jobs WHERE id = ? AND recruiter_id = ?',
      [id, recruiter_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Delete Job Error:', err);
    res.status(500).json({ message: 'Server error deleting job' });
  }
};

// Get stats for recruiter dashboard
exports.getRecruiterStats = async (req, res) => {
  try {
    const recruiter_id = req.user.id;

    const [[{ active_jobs }]] = await db.query(
      'SELECT COUNT(*) as active_jobs FROM jobs WHERE recruiter_id = ? AND status = "active"', 
      [recruiter_id]
    );

    const [[{ total_applicants }]] = await db.query(
      'SELECT COUNT(*) as total_applicants FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.recruiter_id = ?', 
      [recruiter_id]
    );

    const [[{ hired_count }]] = await db.query(
      'SELECT COUNT(*) as hired_count FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.recruiter_id = ? AND a.status = "hired"', 
      [recruiter_id]
    );

    res.status(200).json({
      active_jobs,
      total_applicants,
      hired: hired_count
    });
  } catch (err) {
    console.error('Get Stats Error:', err);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// Get single job details
exports.getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [jobs] = await db.query(`
      SELECT j.*, 
             (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.candidate_id = ?) as hasApplied
      FROM jobs j WHERE j.id = ?
    `, [user_id, id]);

    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found' });
    
    const job = {
      ...jobs[0],
      hasApplied: jobs[0].hasApplied > 0
    };

    res.status(200).json(job);
  } catch (err) {
    console.error('Get Job Details Error:', err);
    res.status(500).json({ message: 'Server error fetching job details' });
  }
};

// Get applicants for a job
exports.getJobApplicants = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiter_id = req.user.id;

    // Verify the job belongs to the recruiter
    const [jobs] = await db.query('SELECT id FROM jobs WHERE id = ? AND recruiter_id = ?', [id, recruiter_id]);
    if (jobs.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or job not found' });
    }

    const [applicants] = await db.query(
      `SELECT a.id as application_id, u.id as user_id, u.full_name, u.email, u.phone, u.location, u.profile_image, u.resume_url, u.skills, u.experience, a.status, a.applied_at
       FROM applications a
       JOIN users u ON a.candidate_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.applied_at DESC`,
      [id]
    );

    res.status(200).json(applicants);
  } catch (err) {
    console.error('Get Applicants Error:', err);
    res.status(500).json({ message: 'Server error fetching applicants' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const recruiter_id = req.user.id;

    // Fetch candidate and job details for the email
    const [details] = await db.query(
      `SELECT u.email, u.full_name, j.title, j.company_name 
       FROM applications a
       JOIN users u ON a.candidate_id = u.id
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [id]
    );

    const info = details[0];

    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);

    // Send status update email
    if (info) {
      let subject = '';
      let message = '';

      if (status === 'shortlisted') {
        subject = `Good News! You've been Shortlisted for ${info.title}`;
        message = `
          Dear ${info.full_name},<br><br>
          We are pleased to inform you that you have been <strong>shortlisted</strong> for the position of <strong>${info.title}</strong> at <strong>${info.company_name}</strong>.<br><br>
          The recruiter will contact you shortly regarding the next steps in the interview process.<br><br>
          Best of luck!<br><br>
          Team JobRush
        `;
      } else if (status === 'hired') {
        subject = `Congratulations! You're Hired at ${info.company_name}`;
        message = `
          Dear ${info.full_name},<br><br>
          We are thrilled to inform you that you have been <strong>selected</strong> for the position of <strong>${info.title}</strong> at <strong>${info.company_name}</strong>!<br><br>
          Congratulations on your new role. The HR team will reach out to you with the official offer letter and onboarding details.<br><br>
          Welcome aboard!<br><br>
          Team JobRush
        `;
      } else if (status === 'rejected') {
        subject = `Update on your application for ${info.title}`;
        message = `
          Dear ${info.full_name},<br><br>
          Thank you for your interest in the <strong>${info.title}</strong> position at <strong>${info.company_name}</strong>.<br><br>
          After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.<br><br>
          We appreciate the time and effort you put into your application and wish you the very best in your job search.<br><br>
          Best regards,<br><br>
          Team JobRush
        `;
      }

      if (subject && message) {
        try {
          await sendEmail({
            email: info.email,
            subject,
            message
          });
        } catch (emailErr) {
          console.error('Status update email failed:', emailErr);
        }
      }
    }

    res.status(200).json({ message: `Application marked as ${status}` });
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      location, 
      salary_min, 
      salary_max, 
      job_type, 
      experience_level, 
      category, 
      skills_required, 
      description,
      openings,
      status
    } = req.body;
    const recruiter_id = req.user.id;

    const [result] = await db.query(
      `UPDATE jobs SET 
        title = ?, location = ?, salary_min = ?, salary_max = ?, 
        job_type = ?, experience_level = ?, category = ?, skills_required = ?, 
        description = ?, openings = ?, status = ?
       WHERE id = ? AND recruiter_id = ?`,
      [
        title, location, salary_min, salary_max, 
        job_type, experience_level, category, skills_required, 
        description, openings, status || 'active', id, recruiter_id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job updated successfully' });
  } catch (err) {
    console.error('Update Job Error:', err);
    res.status(500).json({ message: 'Server error updating job' });
  }
};

// Get all active jobs (for candidates)
exports.getAllJobs = async (req, res) => {
  try {
    const { title, location, category, jobType, experience, maxSalary } = req.query;
    const user_id = req.user.id;

    let query = `
      SELECT j.*, 
             (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id AND a.candidate_id = ?) as hasApplied
      FROM jobs j 
      WHERE j.status = "active"
    `;
    let params = [user_id];

    if (title) {
      query += ' AND (j.title LIKE ? OR j.company_name LIKE ?)';
      params.push(`%${title}%`, `%${title}%`);
    }
    if (location) {
      query += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (category) {
      query += ' AND j.category LIKE ?';
      params.push(`%${category}%`);
    }
    if (jobType && jobType.trim() !== '') {
      const types = jobType.split(',').filter(t => t.trim() !== '');
      if (types.length > 0) {
        query += ` AND j.job_type IN (${types.map(() => '?').join(',')})`;
        params.push(...types);
      }
    }
    if (experience && experience.trim() !== '') {
      const levels = experience.split(',').filter(l => l.trim() !== '');
      if (levels.length > 0) {
        query += ` AND j.experience_level IN (${levels.map(() => '?').join(',')})`;
        params.push(...levels);
      }
    }
    if (maxSalary && parseInt(maxSalary) > 0) {
      query += ' AND j.salary_max <= ?';
      params.push(parseInt(maxSalary));
    }

    query += ' ORDER BY j.posted_at DESC';

    const [jobs] = await db.query(query, params);
    
    const processedJobs = jobs.map(job => ({
      ...job,
      hasApplied: job.hasApplied > 0
    }));

    res.status(200).json(processedJobs);
  } catch (err) {
    console.error('Get Jobs Error:', err);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { id } = req.params; // job_id
    const candidate_id = req.user.id;

    // Check if already applied
    const [existing] = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?',
      [id, candidate_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Verify job exists and is active
    const [jobRows] = await db.query('SELECT * FROM jobs WHERE id = ? AND status = "active"', [id]);
    if (jobRows.length === 0) {
      return res.status(404).json({ message: 'Job not found or no longer active' });
    }
    const job = jobRows[0];

    await db.query(
      'INSERT INTO applications (job_id, candidate_id) VALUES (?, ?)',
      [id, candidate_id]
    );

    // Fetch candidate details for the email
    const [candidateRows] = await db.query('SELECT email, full_name FROM users WHERE id = ?', [candidate_id]);
    const candidate = candidateRows[0];

    // Send confirmation email to candidate
    try {
      if (candidate && candidate.email) {
        await sendEmail({
          email: candidate.email,
          subject: `Application Confirmation: ${job.title} at ${job.company_name}`,
          message: `
            Dear ${candidate.full_name},<br><br>
            You have successfully applied for the position of <strong>${job.title}</strong> at <strong>${job.company_name}</strong> via JobRush.<br><br>
            The recruiter has been notified of your application. You can track your application status on your dashboard.<br><br>
            Best of luck with your application!<br><br>
            Team JobRush
          `
        });
      }
    } catch (emailErr) {
      console.error('Email sending failed during application:', emailErr);
      // We don't fail the request if email fails, but we log it
    }

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Apply Job Error:', err);
    res.status(500).json({ message: 'Server error submitting application' });
  }
};

// Get all applications for a candidate
exports.getCandidateApplications = async (req, res) => {
  try {
    const candidate_id = req.user.id;
    const [applications] = await db.query(
      `SELECT a.id as application_id, a.status, a.applied_at, 
              j.id, j.title, j.company_name, j.location, j.salary_min, j.salary_max
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.candidate_id = ?
       ORDER BY a.applied_at DESC`,
      [candidate_id]
    );
    res.status(200).json(applications);
  } catch (err) {
    console.error('Get Candidate Apps Error:', err);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Toggle Save Job
exports.toggleSaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if already saved
    const [existing] = await db.query(
      'SELECT * FROM saved_jobs WHERE job_id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existing.length > 0) {
      // Unsave
      await db.query('DELETE FROM saved_jobs WHERE job_id = ? AND user_id = ?', [id, user_id]);
      return res.status(200).json({ message: 'Job unsaved', saved: false });
    } else {
      // Save
      await db.query('INSERT INTO saved_jobs (job_id, user_id) VALUES (?, ?)', [id, user_id]);
      return res.status(200).json({ message: 'Job saved', saved: true });
    }
  } catch (err) {
    console.error('Toggle Save Job Error:', err);
    res.status(500).json({ message: 'Server error toggling saved job' });
  }
};

// Get Saved Jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [jobs] = await db.query(
      `SELECT j.* FROM jobs j
       JOIN saved_jobs s ON j.id = s.job_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
      [user_id]
    );
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Get Saved Jobs Error:', err);
    res.status(500).json({ message: 'Server error fetching saved jobs' });
  }
};
// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const recruiter_id = req.user.id;

    // Verify recruiter owns the job and get candidate info for email
    const [applications] = await db.query(`
      SELECT a.id, u.email as candidate_email, u.full_name as candidate_name, j.title as job_title, j.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.candidate_id = u.id
      WHERE a.id = ? AND j.recruiter_id = ?
    `, [id, recruiter_id]);

    if (applications.length === 0) {
      return res.status(403).json({ message: 'Unauthorized or application not found' });
    }

    const application = applications[0];

    await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);

    // Send Email Notification
    try {
      const sendEmail = require('../utils/sendEmail');
      let subject = `Application Update: ${application.job_title} at ${application.company_name}`;
      let message = `Hi ${application.candidate_name},\n\nYour application status for the position of "${application.job_title}" has been updated to: ${status.toUpperCase()}.\n\n`;
      
      if (status === 'shortlisted') {
        message += "Congratulations! You have been shortlisted for the next round. The recruiter will contact you soon for further details.";
      } else if (status === 'hired') {
        message += "Great news! You have been selected for this position. Welcome to the team!";
      } else if (status === 'rejected') {
        message += "Thank you for your interest. Unfortunately, the recruiter has decided to move forward with other candidates at this time. We wish you the best in your job search.";
      } else if (status === 'reviewed') {
        message += "The recruiter has reviewed your application and will reach out if they wish to proceed.";
      }

      await sendEmail({
        email: application.candidate_email,
        subject,
        message
      });
    } catch (mailErr) {
      console.error('Failed to send status update email:', mailErr);
    }

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Update Status Error:', err);
    res.status(500).json({ message: 'Server error updating status' });
  }
};
