const express = require('express');
const path = require('path');
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
const authRoutes = require('./routes/auth');

// Load .env from root
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const app = express();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://solar-mvp-monorepo.vercel.app',
  'https://solar-mvp-monorepo-fron-git-5ccf04-dhananjays-projects-5ff8247c.vercel.app'
];

// Middleware
app.use(helmet()); // Secure HTTP headers

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser clients like Postman
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json()); // Parse JSON bodies

// Debug: Log MONGO_URI
console.log("MONGO_URI:", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Unprotected routes
app.use("/api/auth", authRoutes); // No authMiddleware

// Protected routes
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/subsidies', subsidyRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello, Solar! Backend is running." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack); // Log for debugging
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined, // Show details in dev only
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);