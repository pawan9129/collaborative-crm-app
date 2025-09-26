const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// get Users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
     res.json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
