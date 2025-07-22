const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const customerRoutes = require('./routes/customers');
const quoteRoutes = require('./routes/quotes');
const subsidyRoutes = require('./routes/subsidies');
const projectRoutes = require('./routes/projects');
const inventoryRoutes = require('./routes/inventory');
const dashboardRoutes = require('./routes/dashboard'); 

// Load .env from root
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const app = express();

// Middleware
app.use(helmet()); // Secure HTTP headers (latest helmet 8.0.0 features)
app.use(cors({ origin: 'http://localhost:5173' })); // Allow Vite frontend
app.use(express.json()); // Parse JSON bodies

// Debug: Log MONGO_URI
console.log('MONGO_URI:', process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/subsidies', subsidyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, Solar! Backend is running.' });
});

// Global error handler (latest Express 4.19.x practice)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack); // Log for debugging
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Show details in dev only
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));