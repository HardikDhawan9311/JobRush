const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initDb = async () => {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const dbName = url.pathname.split('/')[1];
    
    // Connection config for "no database" connection
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
    };

    // 1. Connect without database name to create it if it doesn't exist
    const connection = await mysql.createConnection(config);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database "${dbName}" checked/created.`);
    await connection.end();

    // 2. Connect to the actual database to create tables
    const db = await mysql.createConnection({ ...config, database: dbName });
    
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(120) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          role ENUM('candidate','recruiter','admin') NOT NULL,
          profile_image VARCHAR(255),
          resume_url VARCHAR(500),
          skills TEXT,
          experience VARCHAR(50),
          location VARCHAR(100),
          bio TEXT,
          company_name VARCHAR(120),
          company_website VARCHAR(255),
          company_logo VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createOtpsTable = `
      CREATE TABLE IF NOT EXISTS otps (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(120) NOT NULL,
          otp VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createJobsTable = `
      CREATE TABLE IF NOT EXISTS jobs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          recruiter_id INT NOT NULL,
          title VARCHAR(150) NOT NULL,
          company_name VARCHAR(120) NOT NULL,
          company_logo VARCHAR(255),
          location VARCHAR(100),
          salary_min INT,
          salary_max INT,
          job_type ENUM('Full-time','Part-time','Internship','Contract','Remote'),
          experience_level ENUM('Fresher','Junior','Mid','Senior'),
          category VARCHAR(100),
          skills_required TEXT,
          description TEXT,
          openings INT DEFAULT 1,
          status ENUM('active','closed') DEFAULT 'active',
          posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (recruiter_id) REFERENCES users(id)
      );
    `;

    const createApplicationsTable = `
      CREATE TABLE IF NOT EXISTS applications (
          id INT PRIMARY KEY AUTO_INCREMENT,
          job_id INT NOT NULL,
          candidate_id INT NOT NULL,
          status ENUM('pending','reviewed','shortlisted','rejected','hired') DEFAULT 'pending',
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
          FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createSavedJobsTable = `
      CREATE TABLE IF NOT EXISTS saved_jobs (
          id INT PRIMARY KEY AUTO_INCREMENT,
          job_id INT NOT NULL,
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_save (job_id, user_id),
          FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await db.query(createUsersTable);
    await db.query(createOtpsTable);
    await db.query(createJobsTable);
    await db.query(createApplicationsTable);
    await db.query(createSavedJobsTable);

    // 3. Ensure recruiter columns exist in users table (Migration for existing databases)
    const [columns] = await db.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('company_name')) {
      await db.query('ALTER TABLE users ADD COLUMN company_name VARCHAR(120)');
      console.log('Added company_name column to users table');
    }
    if (!columnNames.includes('company_website')) {
      await db.query('ALTER TABLE users ADD COLUMN company_website VARCHAR(255)');
      console.log('Added company_website column to users table');
    }
    if (!columnNames.includes('company_logo')) {
      await db.query('ALTER TABLE users ADD COLUMN company_logo VARCHAR(255)');
      console.log('Added company_logo column to users table');
    }

    // 4. Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory');
    }

    console.log('Tables and directories initialized successfully.');
    await db.end();

  } catch (err) {
    console.error('Error during database initialization:', err.message);
    throw err;
  }
};

module.exports = initDb;
