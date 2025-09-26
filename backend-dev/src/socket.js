const { Server } = require('socket.io');

module.exports = (server, prisma) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // You can restrict this to your frontend URL for security
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a lead room
    socket.on('joinLead', (leadId) => {
      if (!leadId) return;
      socket.join(leadId.toString());
      console.log(`Socket ${socket.id} joined lead ${leadId}`);
    });

    // Update lead status
    socket.on('updateLead', async (data, callback) => {
      try {
        const { id, status } = data;
        if (!id || !status) {
          return callback?.({ success: false, message: 'Lead ID and status required' });
        }

        const updatedLead = await prisma.lead.update({
          where: { id: parseInt(id) },
          data: { status },
        });

        // Emit only to that lead room
        io.to(id.toString()).emit('leadUpdated', updatedLead);
        callback?.({ success: true, lead: updatedLead });
      } catch (error) {
        console.error('Update Lead Error:', error);
        callback?.({ success: false, message: 'Failed to update lead' });
      }
    });

    // Add activity
    socket.on('addActivity', async (data, callback) => {
      try {
        const { leadId, type, content, userId } = data;

        // Validate all fields
        if (!leadId || !type || !content || !userId) {
          return callback?.({ success: false, message: 'All activity fields are required' });
        }

        // Ensure type is valid enum
        const validTypes = ['NOTE', 'CALL', 'EMAIL'];
        if (!validTypes.includes(type)) {
          return callback?.({ success: false, message: `Type must be one of ${validTypes.join(', ')}` });
        }

        // Check if lead exists before creating activity
        const leadExists = await prisma.lead.findUnique({
          where: { id: parseInt(leadId) },
        });
        if (!leadExists) {
          return callback?.({ success: false, message: `Lead with id ${leadId} does not exist` });
        }

        const newActivity = await prisma.activity.create({
          data: {
            leadId: parseInt(leadId),
            type,
            content,
            userId: parseInt(userId),
          },
        });

        // Emit activity to the lead room
        io.to(leadId.toString()).emit('activityAdded', newActivity);
        callback?.({ success: true, activity: newActivity });
      } catch (error) {
        console.error('Add Activity Error:', error);
        callback?.({ success: false, message: 'Failed to add activity' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io; // Optional: return io instance if needed elsewhere
};
