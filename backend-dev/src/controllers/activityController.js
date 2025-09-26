const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createActivity = async (req, res) => {
  const { leadId, type, content } = req.body;

  // Validate required fields
  if (!leadId || !type || !content) {
    return res.status(400).json({ error: 'leadId, type, and content are required' });
  }

  // Validate type
  const validTypes = ['NOTE', 'CALL', 'EMAIL'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `type must be one of ${validTypes.join(', ')}` });
  }

  // Validate authentication
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized: userId missing' });
  }

  try {
    // Check if the lead exists
    const leadExists = await prisma.lead.findUnique({
      where: { id: parseInt(leadId) }
    });

    if (!leadExists) {
      return res.status(400).json({ error: `Lead with id ${leadId} does not exist` });
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        leadId: parseInt(leadId),
        type,
        content,
        userId: req.user.userId,
      },
    });

    // Emit via socket if using realtime
    const io = req.app.get('socketio');
    io.emit('newActivity', activity);

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activity,
    });
  } catch (error) {
    console.error('Prisma createActivity error:', error);
    res.status(500).json({ error: error.message });
  }
};


// controllers/activityController.js
exports.getLeadActivities = async (req, res) => {
  const { leadId } = req.params;
  try {
    const activities = await prisma.activity.findMany({
      where: { leadId: parseInt(leadId) },
      orderBy: { timestamp: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};
