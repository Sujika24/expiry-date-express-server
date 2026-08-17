# Express Server, MongoDB Database Design & Product API Walkthrough

Updated and documented the Express backend for `expiry-date-express-server`, including MongoDB database schema design, indexing, authentication middleware, and complete Product management API module for the Expiry Date Manager application.

## Changes Made

### Express Backend (`expiry-date-express-server`)

- **[server.js](file:///d:/expiry_date_manager/expiry-date-express-server/server.js)**: 
  - Connected MongoDB via `connectDB()`.
  - Added Swagger UI middleware serving documentation at `/api-docs`.
  - Mounted `/auth` and `/api/products` routes.
  - Added `cookie-parser` and `urlencoded` body parser middlewares.
  - Added `/health` health check endpoint and global error handling middleware.

- **[src/models/Product.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/models/Product.js)**:
  - Defined Mongoose schema for `Product` entity (`user`, `title`, `upc`, `amount`, `unit`, `expiryDate`, `categoryOrLocation`, timestamps).
  - Created compound indexes:
    - `{ user: 1, expiryDate: 1 }` (Primary dashboard pagination sorted by nearing expiry & expiry date filtering).
    - `{ user: 1, upc: 1 }` (UPC barcode lookup per user).
    - `{ user: 1, title: 'text' }` (Text search by product title).

- **[src/middleware/authMiddleware.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/middleware/authMiddleware.js)**:
  - Implemented `protect` middleware to extract JWT from `Authorization` header (`Bearer <token>`) or cookies and verify token signature.

- **[src/dao/productDao.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/dao/productDao.js)**:
  - Implemented Product data access layer: `createProduct`, `findProducts`, `countProducts`, `findProductById`, `updateProduct`, and `deleteProduct`.

- **[src/services/productService.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/services/productService.js)**:
  - Implemented business logic for product operations:
    - Pagination calculation (`page`, `limit`, `totalPages`, `totalProducts`).
    - Expiry date range filtering (`1month`, `3months`, `expired`).
    - Search processing (Title regex & UPC exact match).
    - Product input validation and user ownership scoping.

- **[src/controllers/productController.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/controllers/productController.js)**:
  - Handled HTTP request/response lifecycle for `getProducts`, `getProductById`, `createProduct`, `updateProduct`, and `deleteProduct`.

- **[src/routes/productRoutes.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/routes/productRoutes.js)**:
  - Created Express router protected by JWT auth for `/api/products` endpoints.
  - Annotated all endpoints with Swagger/OpenAPI JSDoc documentation schemas.

- **[src/models/User.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/models/User.js)**:
  - Defined Mongoose schema for User entity with `name`, `email`, `password`, and timestamps.

- **[src/dao/userDao.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/dao/userDao.js)**:
  - Implemented data access operations: `createUser`, `findUserByEmail`, and `findUserById`.

- **[src/services/authService.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/services/authService.js)**:
  - Added business logic for user registration and authentication login with JWT generation.

- **[src/controllers/authController.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/controllers/authController.js)**:
  - Handled request/response lifecycle for `register` and `login` endpoints.

- **[src/routes/authRoutes.js](file:///d:/expiry_date_manager/expiry-date-express-server/src/routes/authRoutes.js)**:
  - Created Express router for `POST /auth/register` and `POST /auth/login` with Swagger annotations.

## Verification & Results

### Verified Functionality
- **Syntax Verification**: All Javascript files (`Product.js`, `authMiddleware.js`, `productDao.js`, `productService.js`, `productController.js`, `productRoutes.js`, `server.js`) passed `node --check` with 0 syntax errors.
- **Database Indexing**: Compound indexes `{ user: 1, expiryDate: 1 }` and `{ user: 1, upc: 1 }` ensure optimal performance for paginated dashboard lists and barcode lookups.
- **Interactive Swagger Docs**: Endpoints documented and accessible under `http://localhost:5001/api-docs`.
