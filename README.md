# AI Resume Scanner - Backend

A Node.js/Express backend application for scanning and analyzing resumes using AI technology.

## 🚀 Technologies Used

### Core Framework
- **Node.js** - JavaScript runtime environment
- **Express** (v5.2.1) - Fast, unopinionated web framework for Node.js
- **TypeScript** (v5.9.3) - Type-safe JavaScript for better code quality

### Database & ORM
- **MySQL** - Relational database management system
- **Sequelize** (v6.37.7) - Promise-based Node.js ORM for MySQL
- **Sequelize-TypeScript** (v2.1.6) - TypeScript decorators for Sequelize

### Authentication & Security
- **jsonwebtoken** (v9.0.3) - JSON Web Token implementation
- **bcrypt** (v6.0.0) - Password hashing library

### File Upload & Processing
- **Multer** (v2.0.2) - Middleware for handling `multipart/form-data` (file uploads)
- **pdf-parse** (v2.4.5) - PDF text extraction library

### AI Integration
- **@google/genai** (v1.35.0) - Google Gemini AI SDK for skill extraction from resumes

### Validation
- **Zod** (v4.3.5) - TypeScript-first schema validation library

### Utilities
- **dotenv** (v17.2.3) - Loads environment variables from `.env` file
- **cors** (v2.8.5) - Cross-Origin Resource Sharing middleware

### Development Tools
- **nodemon** (v3.1.11) - Automatically restarts the server during development
- **ts-node** (v10.9.2) - TypeScript execution engine for Node.js

## 📦 Installation

```bash
npm install
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Starts the development server with hot-reload using nodemon (usually at `http://localhost:3000`)

### Production Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist` directory

### Production Mode
```bash
npm start
```
Runs the compiled JavaScript from the `dist` directory

## 🔧 Environment Variables

Create a `.env` file in the root of the backend directory to configure environment-specific variables.

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | MySQL database host | `localhost` | Yes |
| `DB_USER` | MySQL database username | `root` | Yes |
| `DB_PASSWORD` | MySQL database password | `yourpassword` | Yes |
| `DB_NAME` | MySQL database name | `ai_scanner_db` | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | `your-secret-key-here` | Yes |
| `GEMINI_API_KEY` | Google Gemini API key for AI skill extraction | `your-gemini-api-key` | Yes |

### Optional Environment Variables

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `PORT` | Server port number | `3000` | No |

### Example `.env` file

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ai_scanner_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=3000
```

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.ts      # Sequelize database configuration
│   ├── gemini.ts        # Gemini AI integration
│   ├── pdf-text-extract.ts  # PDF text extraction utilities
│   └── types.ts         # TypeScript type definitions
├── controller/          # Business logic controllers
│   └── user.controller.ts
├── middlewares/         # Express middlewares
│   ├── authentication.ts    # JWT authentication middleware
│   ├── errorHandler.ts      # Global error handler
│   └── validationPipe.ts    # Request validation middleware
├── model/               # Sequelize database models
│   ├── User.ts
│   ├── JobRoles.ts
│   └── Applicants.ts
├── routes/              # API route definitions
│   └── user.route.ts
├── services/            # Service layer
│   └── user.service.ts
├── validationSchema/    # Zod validation schemas
│   ├── auth.schema.ts
│   └── jobroles.schema.ts
└── index.ts             # Application entry point
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login

### Job Roles
- `POST /api/v1/job-roles` - Create a new job role
- `GET /api/v1/job-roles` - Get all job roles for the authenticated user
- `PATCH /api/v1/job-roles/:id` - Update a job role
- `DELETE /api/v1/job-roles/:id` - Delete a job role

### Resume Upload & Applicants
- `POST /api/v1/upload-resume` - Upload and scan a resume (PDF)
- `GET /api/v1/applicants` - Get paginated list of scanned applicants
- `GET /api/v1/uploads/:filename` - Download uploaded resume file

## 🗄️ Database Models

### User
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `createdAt`, `updatedAt` (Timestamps)

### JobRoles
- `id` (Primary Key)
- `userId` (Foreign Key → User)
- `name` (String)
- `skills` (JSON Array)
- `createdAt`, `updatedAt` (Timestamps)

### Applicants
- `id` (Primary Key)
- `userId` (Foreign Key → User)
- `name` (String)
- `email` (String)
- `phone` (String)
- `skills` (JSON Array)
- `resume` (String - filename)
- `createdAt`, `updatedAt` (Timestamps)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Input validation with Zod schemas
- File upload validation (PDF only, 10MB limit)
- SQL injection protection via Sequelize ORM

