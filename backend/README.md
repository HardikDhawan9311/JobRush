# ⚙️ Job Rush - Backend

The server-side API for the Job Rush Recruitment Platform. Built with Node.js, Express, and MySQL.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Auth**: JWT, BCrypt.js
- **Email**: Nodemailer, Brevo
- **File Uploads**: Multer

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   - Create a MySQL database named `job_portal`.
   - Run the `schema.sql` script to initialize tables.

3. **Environment Configuration**:
   Create a `.env` file with the following variables:
   ```env
   PORT=5001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=job_portal
   JWT_SECRET=your_jwt_secret
   BREVO_API_KEY=your_brevo_api_key
   EMAIL_USER=your_email
   ```

4. **Run Server**:
   ```bash
   npm run dev
   ```

## 📂 Structure

- `controllers/`: Request handlers and business logic.
- `routes/`: API endpoint definitions.
- `middlewares/`: Auth and validation logic.
- `config/`: Database and environment setup.
- `utils/`: Helper functions (email, OTP, etc.).
- `schema.sql`: Database schema definition.
