const express = require('express');
const cors = require('cors');
const { initRabbitMQ } = require('./config/rabbitmqConfig.js');
const authRoutes = require('./routes/authRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');
const companyRoutes = require('./routes/companyRoutes.js');
const projectRoutes = require('./routes/projectRoutes.js');
const vendorRoutes = require('./routes/vendorRoutes.js');
const projectVendors = require('./routes/projectVendors.js');
const sequelize = require('./config/database');
require('dotenv').config(); // 👈 Load env vars at the top
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/exports', express.static(path.join(__dirname, 'exports')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/project-vendors', projectVendors);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize RabbitMQ connection
initRabbitMQ()
  .then(() => {
    console.log('RabbitMQ initialized');
  })
  .catch((err) => {
    console.error('Failed to initialize RabbitMQ:', err);
  });
  sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully.');
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

