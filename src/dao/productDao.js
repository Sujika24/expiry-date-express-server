const Product = require('../models/Product');

class ProductDao {
  async createProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findProducts({ query = {}, sort = { expiryDate: 1 }, skip = 0, limit = 20 }) {
    return await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countProducts(query = {}) {
    return await Product.countDocuments(query);
  }

  async findProductById(productId, userId) {
    return await Product.findOne({ _id: productId, user: userId }).lean();
  }

  async updateProduct(productId, userId, updateData) {
    return await Product.findOneAndUpdate(
      { _id: productId, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async deleteProduct(productId, userId) {
    return await Product.findOneAndDelete({ _id: productId, user: userId });
  }
}

module.exports = new ProductDao();
