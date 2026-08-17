const productService = require('../services/productService');

class ProductController {
  async getProducts(req, res) {
    try {
      const userId = req.user.id;
      const { page, limit, search, expiryFilter } = req.query;

      const result = await productService.getProducts({
        userId,
        page,
        limit,
        search,
        expiryFilter,
      });

      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: result.products,
        pagination: result.pagination,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching products',
      });
    }
  }

  async getProductById(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const product = await productService.getProductById(id, userId);

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error fetching product',
      });
    }
  }

  async createProduct(req, res) {
    try {
      const userId = req.user.id;
      const product = await productService.createProduct(userId, req.body);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error creating product',
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const updatedProduct = await productService.updateProduct(id, userId, req.body);

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error updating product',
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await productService.deleteProduct(id, userId);

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error deleting product',
      });
    }
  }
}

module.exports = new ProductController();
