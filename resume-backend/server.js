const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const resumeRoutes = require('./routes/resumeRoutes'); // Import routes

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/resume', resumeRoutes);

// Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Start server only after DB is connected
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
