const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

class AuthService {
  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    const secret = process.env.JWT_SECRET || 'default_secret_key';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  async registerUser({ name, email, password }) {
    const existingUser = await userDao.findUserByEmail(email);
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userDao.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token,
    };
  }

  async loginUser({ email, password }) {
    const user = await userDao.findUserByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}

module.exports = new AuthService();
