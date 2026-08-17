const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// All product routes require authentication
router.use(protect);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         user:
 *           type: string
 *           description: User ID owner
 *         title:
 *           type: string
 *           description: Product title
 *         upc:
 *           type: string
 *           description: UPC Barcode string
 *         amount:
 *           type: number
 *           description: Quantity/Amount of item
 *         unit:
 *           type: string
 *           description: Unit of measurement (e.g. pcs, kg, L)
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date
 *         categoryOrLocation:
 *           type: string
 *           description: Pantry/Fridge location category
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductInput:
 *       type: object
 *       required:
 *         - title
 *         - expiryDate
 *       properties:
 *         title:
 *           type: string
 *           example: Whole Milk 1L
 *         upc:
 *           type: string
 *           example: 012345678905
 *         amount:
 *           type: number
 *           example: 2
 *         unit:
 *           type: string
 *           example: pcs
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: 2026-09-01
 *         categoryOrLocation:
 *           type: string
 *           example: Fridge
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get user's products (Paginated, filtered, searched, sorted by nearing expiry)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search string for product Title or UPC barcode
 *       - in: query
 *         name: expiryFilter
 *         schema:
 *           type: string
 *           enum: [1month, 3months, expired]
 *         description: Filter by expiry date range
 *     responses:
 *       200:
 *         description: List of products returned successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details retrieved
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:id', productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router;
