const express = require('express');
const http = require('http');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const socketIo = require('./socket');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
const server = http.createServer(app);

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');
const activityRoutes = require('./routes/activityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/activities', activityRoutes);

const io = socketIo(server, prisma);
app.set('socketio', io);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));