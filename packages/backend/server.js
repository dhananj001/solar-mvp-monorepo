const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

// Load environment variables
// dotenv.config();

// Load .env from root
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") }); // Explicit path for clarity

const app = express();

// Middleware
app.use(helmet()); // Add security headers
app.use(cors({ origin: "http://localhost:5173" })); // Allow React (Vite port)
app.use(express.json()); // Parse JSON requests

// Debug: Log MONGO_URI
console.log("MONGO_URI:", process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello, Solar! Backend is running.' });
});
// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello, Solar! Backend is running." });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
