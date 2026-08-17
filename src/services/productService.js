const productDao = require('../dao/productDao');

class ProductService {
  async getProducts({ userId, page = 1, limit = 20, search, expiryFilter }) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Base query scoped to authenticated user
    const query = { user: userId };

    // Handle Expiry Date Filters
    if (expiryFilter) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (expiryFilter === '1month') {
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
        query.expiryDate = { $gte: now, $lte: endDate };
      } else if (expiryFilter === '3months') {
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 3);
        query.expiryDate = { $gte: now, $lte: endDate };
      } else if (expiryFilter === 'expired') {
        query.expiryDate = { $lt: now };
      }
    }

    // Handle Search (Title or UPC matching)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { upc: search.trim() },
      ];
    }

    const [products, totalProducts] = await Promise.all([
      productDao.findProducts({
        query,
        sort: { expiryDate: 1 },
        skip,
        limit: limitNum,
      }),
      productDao.countProducts(query),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    return {
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    };
  }

  async getProductById(productId, userId) {
    const product = await productDao.findProductById(productId, userId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(userId, { title, upc, amount, unit, expiryDate, categoryOrLocation }) {
    if (!title || !title.trim()) {
      const error = new Error('Product title is required');
      error.statusCode = 400;
      throw error;
    }

    if (!expiryDate) {
      const error = new Error('Expiry date is required');
      error.statusCode = 400;
      throw error;
    }

    const parsedDate = new Date(expiryDate);
    if (isNaN(parsedDate.getTime())) {
      const error = new Error('Invalid expiry date format');
      error.statusCode = 400;
      throw error;
    }

    const productData = {
      user: userId,
      title: title.trim(),
      upc: upc ? upc.trim() : '',
      amount: amount ? Number(amount) : 1,
      unit: unit ? unit.trim() : 'pcs',
      expiryDate: parsedDate,
      categoryOrLocation: categoryOrLocation ? categoryOrLocation.trim() : 'Pantry',
    };

    return await productDao.createProduct(productData);
  }

  async updateProduct(productId, userId, updateData) {
    const existing = await productDao.findProductById(productId, userId);
    if (!existing) {
      const error = new Error('Product not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    const fieldsToUpdate = {};
    if (updateData.title !== undefined) fieldsToUpdate.title = updateData.title.trim();
    if (updateData.upc !== undefined) fieldsToUpdate.upc = updateData.upc.trim();
    if (updateData.amount !== undefined) fieldsToUpdate.amount = Number(updateData.amount);
    if (updateData.unit !== undefined) fieldsToUpdate.unit = updateData.unit.trim();
    if (updateData.expiryDate !== undefined) {
      const parsedDate = new Date(updateData.expiryDate);
      if (isNaN(parsedDate.getTime())) {
        const error = new Error('Invalid expiry date format');
        error.statusCode = 400;
        throw error;
      }
      fieldsToUpdate.expiryDate = parsedDate;
    }
    if (updateData.categoryOrLocation !== undefined) {
      fieldsToUpdate.categoryOrLocation = updateData.categoryOrLocation.trim();
    }

    return await productDao.updateProduct(productId, userId, fieldsToUpdate);
  }

  async deleteProduct(productId, userId) {
    const deleted = await productDao.deleteProduct(productId, userId);
    if (!deleted) {
      const error = new Error('Product not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new ProductService();
