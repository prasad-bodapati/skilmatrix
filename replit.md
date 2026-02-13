# Enterprise Skill Matrix & Adaptive Assessment Platform

## Overview
Full-stack internal corporate application to track and level-up developer skills across tech stacks and project components. Features role-based access control (Root, Team Admin, Developer), assessment engine with levels 1-10, and dashboards with timeline visualization.

## Tech Stack
- **Backend**: Java 17+ with Spring Boot 3.1, Spring Security (JWT), Spring Data JPA
- **Frontend**: React 18 with TypeScript, Tailwind CSS, React Router
- **Database**: PostgreSQL (Replit built-in)
- **Build**: Maven (backend), Vite (frontend)

## Project Structure
```
backend/
  src/main/java/com/skillmatrix/
    entity/          - JPA entities (AppUser, Team, Project, Component, Question, Assessment, etc.)
    repository/      - Spring Data JPA repositories
    service/         - Business logic (AuthService, AssessmentService)
    controller/      - REST API controllers (AuthController, DataController, AssessmentController)
    security/        - JWT auth (JwtUtil, JwtAuthFilter)
    config/          - Security config, DataSeeder (populates mock data)
    dto/             - Request/Response DTOs
  src/main/resources/
    application.properties - Database and JWT configuration

frontend/
  src/
    api.ts           - API client with JWT token management
    App.tsx           - Main app with routing and auth context
    components/
      Login.tsx       - Login page
      Register.tsx    - User registration
      VerifyEmail.tsx - Email verification
      SetPassword.tsx - Password setup with security question
      ResetPassword.tsx - Password reset flow
      AdminDashboard.tsx - Admin dashboard with team ratings, invites, reviews
      DeveloperDashboard.tsx - Developer dashboard with skills, history, timeline
      TakeAssessment.tsx - Assessment taking interface
      MyProfile.tsx     - My Profile page (own assessments, skills, timeline)
```

## Running the Application
- Backend runs on port 8080 (Spring Boot)
- Frontend runs on port 5000 (Vite dev server with proxy to backend)
- Combined workflow: "Start application"

## Test Accounts (seeded in database)
- Root: admin@skillmatrix.com / password123
- Team Admin: james@skillmatrix.com / password123
- Developer: alex@skillmatrix.com / password123
- All other users: password123

## API Endpoints
- POST /api/auth/login - Login
- POST /api/auth/register - Register
- POST /api/auth/verify - Verify email
- POST /api/auth/set-password - Set password
- POST /api/auth/reset-password - Reset password
- GET /api/teams - List teams
- GET /api/users - List users
- GET /api/dashboard/admin - Admin dashboard data
- GET /api/dashboard/developer/{userId} - Developer dashboard data
- POST /api/assessments/invite - Create assessment invite
- POST /api/assessments/start/{inviteId} - Start assessment
- POST /api/assessments/submit/{attemptId} - Submit assessment

## Recent Changes
- 2026-02-13: Redesigned Teams page in Admin Dashboard
  - Teams shown as clickable cards with developer count and project count
  - Click team to see developers list with search functionality
  - Click developer to see component skills, assessment history, and send assessment invite
  - Assessment invite has separate Component and Skill Level selectors
- 2026-02-09: Added My Profile page (/profile)
  - Accessible to all authenticated users (any role)
  - Shows user info, assessment history table, skill levels, growth timeline
  - Profile button added to Admin and Developer dashboard headers
  - Back button to return to appropriate dashboard
- 2026-02-08: Initial build of the complete platform
  - Full backend with Spring Boot, JPA entities, REST APIs, JWT auth
  - React frontend with admin/developer dashboards, assessment engine
  - Mock data seeded in PostgreSQL database
  - Timeline visualization for developer growth
