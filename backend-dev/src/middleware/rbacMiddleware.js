const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Check if the user has the required role.
 * @param {string[]} roles The required roles.
 * @returns {import('express').RequestHandler}
 */
module.exports = (roles) => async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};