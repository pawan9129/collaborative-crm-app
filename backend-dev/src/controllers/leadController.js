const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all leads.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
exports.getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ include: { assigned: true } });
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

/**
 * Create a new lead.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
// exports.createLead = async (req, res) => {
//   const { name, email, phone, status, assignedTo } = req.body;

//   // Basic validation
//   if (!name || !email || !phone || !status) {
//     return res.status(400).json({ error: "Name, email, phone, and status are required" });
//   }

//   // Validate status
//   const validStatuses = ["NEW", "ASSIGNED", "CLOSED"];
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ error: `Status must be one of ${validStatuses.join(", ")}` });
//   }

//   try {
//     const lead = await prisma.lead.create({
//       data: {
//         name,
//         email,
//         phone,
//         status,
//         assignedTo: assignedTo ? parseInt(assignedTo) : req.user.userId,
//       },
//     });

//     res.status(201).json({ message: "Lead created successfully", lead });
//   } catch (error) {
//     console.error("Lead creation error:", error);

//     // Check if it's a Prisma validation error
//     if (error.code === "P2002") {
//       return res.status(400).json({ error: "Lead with this email already exists" });
//     }

//     res.status(500).json({ error: "Lead creation failed" });
//   }
// };

exports.createLead = async (req, res) => {
  const { name, email, phone, status, assignedTo } = req.body;

  try {
    console.log("create>>>>>>>",req.user.userId)
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        status,
        assignedTo: assignedTo ? parseInt(assignedTo) : null,
        createdBy: req.user.userId,
      },
    });
    res.status(201).json({ message: 'Lead created successfully', lead });
  } catch (error) {
    console.error("Lead creation error:", error);
    res.status(500).json({ error: 'Lead creation failed', details: error.message });
  }
};

/**
 * Update a lead.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
// exports.updateLead = async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phone, status, assignedTo } = req.body;
//   try {
//     const lead = await prisma.lead.update({
//       where: { id: parseInt(id) },
//       data: {
//         name,
//         email,
//         phone,
//         status,
//         assignedTo,
//       },
//     });
//     res.json({ message: 'Lead updated successfully', lead });
//   } catch (error) {
//     res.status(400).json({ error: 'Lead update failed' });
//   }
// };


exports.updateLead = async (req, res) => {
  const { id } = req.params;
  const { status, name, email } = req.body;

  try {
    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json(updatedLead);
  } catch (error) {
    console.error("Update lead error:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
};

/**
 * Delete a lead.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 */
exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.lead.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Lead deletion failed' });
  }
};

/**
 * Get a single lead by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getLeadById = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(id) },
      include: { assigned: true }, // include relations if needed
    });

    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

