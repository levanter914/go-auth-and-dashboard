# Billing Dashboard
- A fullstack billing management system with user authentication, profile handling, and Bill PDF generation.

# Tech Stack
- Frontend: React + Vite
- Backend: Go (Golang)
- Database: PostgreSQL
- File Storage: Amazon S3
- Authentication: JWT with bcrypt password hashing
- PDF Generation: gofpdf

# Features

- Signup/Login: Secure user authentication using JWT and bcrypt
- Profile Picture Upload: Stored in Amazon S3 during signup
- Dashboard: Displays user profile and associated bill list
- Generate & Print PDF: Bills are converted to PDFs using gofpdf with custom size and printed via browser
- Data Persistence: All user and billing data stored in PostgreSQL