const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = generateOTP();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Save to DB
    await db.query('DELETE FROM otps WHERE email = ?', [email]);
    await db.query('INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expires_at]);

    // Send Email
    await sendEmail({
      email,
      subject: 'JobRush OTP Verification',
      message: `Your OTP code is: ${otp}. This code expires in 5 minutes.`
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
};

// Register User
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, phone, otp } = req.body;

    // 1. Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    // 2. Role-based OTP Check
    if (role === 'recruiter') {
      if (!otp) return res.status(400).json({ message: 'OTP is required for recruiters' });
      
      const [otpRecord] = await db.query(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
        [email, otp]
      );
      
      if (otpRecord.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      // Cleanup OTP
      await db.query('DELETE FROM otps WHERE email = ?', [email]);
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, role, phone]
    );

    // 4. Generate Token
    const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { 
        id: result.insertId, 
        full_name, 
        email, 
        role,
        profile_image: null
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // 1. Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    
    const user = users[0];

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3. Recruiter Flow (Requires OTP)
    if (user.role === 'recruiter') {
      if (!otp) {
        // Trigger OTP generation and send
        const loginOtp = generateOTP();
        const expires_at = new Date(Date.now() + 5 * 60 * 1000);
        await db.query('DELETE FROM otps WHERE email = ?', [email]);
        await db.query('INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, loginOtp, expires_at]);
        
        await sendEmail({
          email,
          subject: 'JobRush Login Verification',
          message: `Your login OTP is: ${loginOtp}`
        });

        return res.status(200).json({ message: 'OTP_SENT' });
      }

      // Verify provided OTP
      const [otpRecord] = await db.query(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
        [email, otp]
      );
      if (otpRecord.length === 0) return res.status(400).json({ message: 'Invalid or expired OTP' });
      
      await db.query('DELETE FROM otps WHERE email = ?', [email]);
    }

    // 4. Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        full_name: user.full_name, 
        email: user.email, 
        role: user.role,
        profile_image: user.profile_image 
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// Update Password with OTP
exports.updatePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    // 1. Verify OTP
    const [otpRecord] = await db.query(
      'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
      [email, otp]
    );

    if (otpRecord.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 2. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update User
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Cleanup OTP
    await db.query('DELETE FROM otps WHERE email = ?', [email]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update Password Error:', err);
    res.status(500).json({ message: 'Server error during password update' });
  }
};
