# 🚀 Job Rush - Modern Recruitment Platform

Job Rush is a high-performance, full-stack recruitment platform designed to bridge the gap between talented candidates and top-tier recruiters. Built with a focus on visual excellence and seamless user experience, it offers a robust suite of tools for job posting, application tracking, and AI-driven candidate engagement.


## ✨ Key Features

### 🏢 For Recruiters
- **Dynamic Job Management**: Effortlessly create, edit, and close job postings.
- **Advanced Dashboard**: Real-time visualization of application trends using interactive charts.
- **Applicant Tracking System (ATS)**: Manage candidate lifecycles with statuses like Pending, Shortlisted, Rejected, and Hired.
- **Data Export**: Export candidate lists to CSV for offline analysis.
- **AI Efficiency**: Integrated keyword-based AI chatbot to assist in screening.

### 🎓 For Candidates
- **Smart Job Search**: Filter opportunities by salary, location, job type, and experience level.
- **OTP-Based Authentication**: Secure and hassle-on registration/login using email-based OTPs.
- **Profile Management**: Maintain a professional profile with skills, experience, and resumes.
- **Real-time Notifications**: Get notified of application status changes instantly.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS 4, Framer Motion (Animations)
- **UI Components**: Shadcn UI (Radix UI), Recharts (Data Viz), Lucide React (Icons)
- **State & Forms**: React Hook Form, Context API
- **Notifications**: Sonner

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Auth**: JWT (JSON Web Tokens), BCrypt.js
- **Communication**:Brevo (Email Service)
- **File Handling**: Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/HardikDhawan9311/JobRush.git
cd JobRush
```

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend` directory:
```env
PORT=5001
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=job_portal
JWT_SECRET=your_secret_key
BREVO_API_KEY=your_brevo_key
EMAIL_USER=your_email
```
- Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
- Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001
```
- Start the development server:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
JobRush/
├── backend/
│   ├── config/         # Database and app configurations
│   ├── controllers/    # Business logic for routes
│   ├── middlewares/    # Auth and validation middlewares
│   ├── routes/         # API endpoints
│   ├── schema.sql      # Database initialization script
│   └── index.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   │   ├── context/    # Global state management
│   │   └── assets/     # Images and styles
│   └── index.html
└── README.md
```

---

## 📊 Database Overview

The project uses a relational MySQL database with the following core entities:
- **Users**: Handles roles (Candidate/Recruiter), profiles, and auth data.
- **Jobs**: Stores job details, requirements, and recruiter links.
- **Applications**: Maps candidates to jobs with status tracking.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by [Hardik Dhawan](https://github.com/HardikDhawan9311)**
