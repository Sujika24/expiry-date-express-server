# Product API Implementation Tasks & REST Signatures

## Task List

- [x] **Task 1: Fetch Products API (Dashboard, Pagination, Search & Filtering)**
  - Signature: `GET /api/products`
  - Supports pagination (limit=20), expiry range filtering (`1month`, `3months`, `expired`), and keyword search (Title / UPC code).

- [x] **Task 2: Get Single Product API**
  - Signature: `GET /api/products/:id`
  - Retrieves detailed product record for pre-filling edit forms or viewing single item.

- [x] **Task 3: Add Product API**
  - Signature: `POST /api/products`
  - Creates a new product record from barcode scan (UPC) or manual input (`title`, `upc`, `amount`, `unit`, `expiryDate`, `categoryOrLocation`).

- [x] **Task 4: Edit/Update Product API**
  - Signature: `PUT /api/products/:id`
  - Updates specified fields of an existing product owned by the authenticated user.

- [x] **Task 5: Delete Product API**
  - Signature: `DELETE /api/products/:id`
  - Removes a product entry from the authenticated user's inventory.

---

## Detailed REST API Signatures

### 1. Get Products List (Dashboard, Pagination, Search, Filters)

- **Endpoint**: `GET /api/products`
- **Description**: Fetch user's inventory sorted by nearing expiry date. Supports pagination (max 20 per page default), text search by title or UPC, and filter by expiry date range.
- **Headers**:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | No | `1` | Page number for pagination |
  | `limit` | Integer | No | `20` | Items per page (max 100) |
  | `search` | String | No | - | Search keyword for `title` or exact `upc` match |
  | `expiryFilter` | String | No | - | Expiry range filter: `1month`, `3months`, `expired` |

- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": [
      {
        "_id": "66c0e5a1f2b3c4d5e6f7a8b9",
        "user": "66c0d1e2f3a4b5c6d7e8f9a0",
        "title": "Fresh Milk 1L",
        "upc": "012345678905",
        "amount": 2,
        "unit": "pcs",
        "expiryDate": "2026-08-20T00:00:00.000Z",
        "categoryOrLocation": "Fridge",
        "createdAt": "2026-08-17T10:00:00.000Z",
        "updatedAt": "2026-08-17T10:00:00.000Z"
      }
    ],
    "pagination": {
      "totalProducts": 42,
      "totalPages": 3,
      "currentPage": 1,
      "limit": 20
    }
  }
  ```

---

### 2. Get Single Product by ID

- **Endpoint**: `GET /api/products/:id`
- **Description**: Fetch a single product item details owned by the authenticated user.
- **Headers**:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "66c0e5a1f2b3c4d5e6f7a8b9",
      "user": "66c0d1e2f3a4b5c6d7e8f9a0",
      "title": "Fresh Milk 1L",
      "upc": "012345678905",
      "amount": 2,
      "unit": "pcs",
      "expiryDate": "2026-08-20T00:00:00.000Z",
      "categoryOrLocation": "Fridge",
      "createdAt": "2026-08-17T10:00:00.000Z",
      "updatedAt": "2026-08-17T10:00:00.000Z"
    }
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Product not found"
  }
  ```

---

### 3. Add Product

- **Endpoint**: `POST /api/products`
- **Description**: Create a new product item in the user's inventory (supports UPC scan auto-fill or manual entry).
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <jwt_token>
  ```
- **Request Body**:
  ```json
  {
    "title": "Greek Yogurt 500g",
    "upc": "890123456789",
    "amount": 3,
    "unit": "pcs",
    "expiryDate": "2026-09-15",
    "categoryOrLocation": "Fridge"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "_id": "66c0f6b2a3b4c5d6e7f8a9b0",
      "user": "66c0d1e2f3a4b5c6d7e8f9a0",
      "title": "Greek Yogurt 500g",
      "upc": "890123456789",
      "amount": 3,
      "unit": "pcs",
      "expiryDate": "2026-09-15T00:00:00.000Z",
      "categoryOrLocation": "Fridge",
      "createdAt": "2026-08-17T15:30:00.000Z",
      "updatedAt": "2026-08-17T15:30:00.000Z"
    }
  }
  ```
- **Error Response (`400 Bad Request`)**:
  ```json
  {
    "success": false,
    "message": "Product title is required"
  }
  ```

---

### 4. Edit / Update Product

- **Endpoint**: `PUT /api/products/:id`
- **Description**: Update an existing product owned by the user.
- **Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <jwt_token>
  ```
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.
- **Request Body**:
  ```json
  {
    "title": "Greek Yogurt 500g (Updated)",
    "amount": 2,
    "expiryDate": "2026-09-20"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {
      "_id": "66c0f6b2a3b4c5d6e7f8a9b0",
      "user": "66c0d1e2f3a4b5c6d7e8f9a0",
      "title": "Greek Yogurt 500g (Updated)",
      "upc": "890123456789",
      "amount": 2,
      "unit": "pcs",
      "expiryDate": "2026-09-20T00:00:00.000Z",
      "categoryOrLocation": "Fridge",
      "createdAt": "2026-08-17T15:30:00.000Z",
      "updatedAt": "2026-08-17T15:35:00.000Z"
    }
  }
  ```

---

### 5. Delete Product

- **Endpoint**: `DELETE /api/products/:id`
- **Description**: Delete a product from user's inventory.
- **Headers**:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Path Parameters**:
  - `id`: MongoDB ObjectId of the product.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```
- **Error Response (`404 Not Found`)**:
  ```json
  {
    "success": false,
    "message": "Product not found or unauthorized"
  }
  ```
