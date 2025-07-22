const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const customerRoutes = require('./routes/customers'); // Import customer routes

// Load .env from root
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const app = express();
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

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
app.use('/api/customers', customerRoutes); // Use customer routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, Solar! Backend is running.' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));