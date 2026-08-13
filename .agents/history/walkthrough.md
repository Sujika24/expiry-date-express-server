# Express Server & Authentication API Walkthrough

Updated and documented the Express backend for `expiry-date-express-server`, including MongoDB database connectivity, OpenAPI/Swagger documentation, and a complete User Authentication API module.

## Changes Made

### Express Backend (`expiry-date-express-server`)

- **[server.js](file:///d:/expiry_date_manager/expiry-date-express-server/server.js)**: 
  - Connected MongoDB via `connectDB()`.
  - Added Swagger UI middleware serving documentation at `/api-docs`.
  - Mounted `/auth` routes.
  - Added `cookie-parser` and `urlencoded` body parser middlewares.
  - Added `/health` health check endpoint and global error handling middleware.

- **[src/config/db.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/config/db.js)**:
  - Integrated Mongoose connection logic using `process.env.MONGODB_URI`.

- **[src/config/swagger.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/config/swagger.js)**:
  - Configured `swagger-jsdoc` with OpenAPI specification metadata and route scanning.

- **[src/models/User.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/models/User.js)**:
  - Defined Mongoose schema for User entity with `name`, `email`, `password`, `role`, and timestamps.

- **[src/dao/userDao.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/dao/userDao.js)**:
  - Implemented data access operations: `createUser`, `findUserByEmail`, and `findUserById`.

- **[src/services/authService.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/services/authService.js)**:
  - Added business logic for user registration and authentication login.
  - Implemented password hashing with `bcryptjs` and JSON Web Token (JWT) generation with `jsonwebtoken`.

- **[src/controllers/authController.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/controllers/authController.js)**:
  - Handled request/response lifecycle for `register` and `login` endpoints.

- **[src/routes/authRoutes.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/routes/authRoutes.js)**:
  - Created Express router for `POST /auth/register` and `POST /auth/login`.
  - Annotated endpoints with Swagger/OpenAPI JSDoc documentation schemas.

- **[src/utils/validators.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/utils/validators.js)**:
  - Created validation utilities for email formatting and password complexity requirements.

## Verification & Results

### Verified Functionality
- **Database Connectivity**: Successfully connected to MongoDB database instance.
- **Server Health Check**: `GET /` and `GET /health` return HTTP 200 with status info and timestamps.
- **Swagger Documentation**: Accessible at `http://localhost:5001/api-docs` displaying all interactive API endpoints.
- **User Authentication Flow**:
  - `POST /auth/register`: Validates user inputs, hashes passwords, persists user to database, and returns user details.
  - `POST /auth/login`: Authenticates credentials, compares hashed passwords, and returns signed JWT tokens.
