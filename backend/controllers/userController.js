const db = require('../config/db');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, profile_image, resume_url, skills, experience, location, bio, company_name, company_website, company_logo, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, email, phone, skills, experience, location, bio, company_name, company_website } = req.body;
    const userId = req.user.id;

    let profile_image = req.files?.profile_image ? `/uploads/${req.files.profile_image[0].filename}` : undefined;
    let resume_url = req.files?.resume_url ? `/uploads/${req.files.resume_url[0].filename}` : undefined;
    let company_logo = req.files?.company_logo ? `/uploads/${req.files.company_logo[0].filename}` : undefined;

    // Build update query dynamically
    let query = 'UPDATE users SET full_name = ?, email = ?, phone = ?, skills = ?, experience = ?, location = ?, bio = ?, company_name = ?, company_website = ?';
    let params = [full_name, email, phone, skills, experience, location, bio, company_name, company_website];

    if (profile_image) {
      query += ', profile_image = ?';
      params.push(profile_image);
    }

    if (resume_url) {
      query += ', resume_url = ?';
      params.push(resume_url);
    }

    if (company_logo) {
      query += ', company_logo = ?';
      params.push(company_logo);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    await db.query(query, params);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Get a candidate's profile (for recruiters)
exports.getCandidateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query(
      'SELECT id, full_name, email, phone, role, profile_image, resume_url, skills, experience, location, bio, company_name, company_website, company_logo, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    console.error('Get Candidate Profile Error:', err);
    res.status(500).json({ message: 'Server error fetching candidate profile' });
  }
};
