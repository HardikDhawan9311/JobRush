# 🏗️ Architecture Documentation - Job Rush

## 🏛️ System Overview

Job Rush follows a classic **Client-Server** architecture with a decoupled Frontend and Backend, allowing for independent scaling and maintenance.

### 🌐 Frontend (Client Side)
Built using **React 18** and **Vite**, the frontend is a Single Page Application (SPA).
- **Styling**: Utilizes **Tailwind CSS 4** for utility-first styling and **Framer Motion** for premium animations.
- **State Management**: Uses React's **Context API** for global states like User Authentication and Theme.
- **Routing**: Handled by **React Router 7**, supporting protected routes for Recruiters and Candidates.
- **UI Components**: Leveraging **Radix UI** primitives and **Lucide React** for a consistent and accessible interface.

### ⚙️ Backend (Server Side)
A RESTful API built with **Node.js** and **Express.js**.
- **Authentication**: Stateless authentication using **JWT**. Passwords are hashed with **BCrypt.js**.
- **API Pattern**: Follows the **Controller-Route** pattern. Routes define the endpoints, and Controllers contain the business logic.
- **Middleware**: 
  - `authMiddleware`: Validates JWT tokens.
  - `roleMiddleware`: Ensures users have the correct permissions (e.g., only recruiters can post jobs).
  - `multer`: Handles multipart/form-data for profile image and resume uploads.

### 🗄️ Database (Persistence)
**MySQL** is used for structured data storage.
- **Relational Integrity**: Uses Foreign Keys to link Jobs to Recruiters and Applications to Jobs/Candidates.
- **Schema Management**: Managed via a `schema.sql` file for reproducible environment setups.

---

## 🚦 Flow of Data

1. **Authentication Flow**:
   - User enters email -> Backend generates OTP -> Sent via Nodemailer/Brevo.
   - User enters OTP -> Backend verifies -> Returns JWT.
   - Frontend stores JWT in `localStorage` or `cookies`.

2. **Job Application Flow**:
   - Candidate clicks 'Apply' -> Frontend sends `POST` request with JWT.
   - Backend validates user -> Checks if already applied -> Creates entry in `applications` table.
   - Recruiter dashboard updates in real-time via status fetch.

---

## 🛠️ Infrastructure & Deployment
- **Frontend**: Optimized for deployment on platforms like **Vercel** or **Netlify**.
- **Backend**: Can be hosted on **Render**, **Heroku**, or a VPS with **PM2**.
- **Environment Variables**: Managed via `.env` files (never committed to version control).

---

## 🔒 Security Measures
- **Input Validation**: Sanitizing user inputs to prevent SQL injection (using `mysql2` prepared statements).
- **CORS**: Configured to only allow requests from trusted origins.
- **Rate Limiting**: (Planned) To prevent brute-force attacks on OTP endpoints.
