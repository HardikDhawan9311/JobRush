-- Create Database
CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Create Users Table
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
    company_name VARCHAR(150),
    company_website VARCHAR(255),
    company_logo VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Jobs Table
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

-- Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,

    status ENUM('pending','reviewed','shortlisted','rejected','hired') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);
