# JobPortal Backend Server

This is the backend server for the JobPortal application, providing API endpoints for user authentication, job management, applications, and company profiles.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Create a `.env` file in the server directory (already done)
   - Set the following variables:
     - `MONGODB_URI`: MongoDB connection string
     - `JWT_SECRET`: Secret key for JWT token generation
     - `PORT`: Server port (default: 5000)

3. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user (jobseeker or employer)
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile (requires authentication)

### Jobs
- `POST /api/jobs` - Create a new job posting (employers only)
- `GET /api/jobs` - Get all job listings
- `GET /api/jobs/:id` - Get job details by ID
- `POST /api/jobs/:id/apply` - Apply for a job (jobseekers only)
- `GET /api/jobs/:id/applications` - Get applications for a job (employers only)

### Applications
- `GET /api/applications/me` - Get my job applications (jobseekers only)

### Companies
- `POST /api/companies` - Create or update company profile (employers only)
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company details by ID

## Models

### User
- firstName
- lastName
- email
- password (hashed)
- role (jobseeker or employer)
- createdAt
- verified

### Job
- title
- company
- location
- description
- requirements
- salary
- employerId
- createdAt
- expiresAt

### Application
- jobId
- jobseekerId
- resume
- coverLetter
- status
- appliedAt

### Company
- name
- description
- logo
- website
- location
- employerId
- createdAt