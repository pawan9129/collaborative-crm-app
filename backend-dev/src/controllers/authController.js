const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { param } = require('../routes/authRoutes');
const prisma = new PrismaClient();

/**
 * Register a new user.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    console.log("registration",name,email,password,role)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.log("err",error)
    res.status(400).json({ error: 'User registration failed' });
  }
};

/**
 * Login a user.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("email", email, password)
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("match", isMatch)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log("token", token);
    // Create a refresh token
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET);
    console.log("refresstoken>>>>>>>>>>>>>>>>", refreshToken)
    // Save the refresh token to the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({ message: 'Login successful', token, refreshToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Refresh the JWT.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Create a new JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Token refreshed successfully', token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};