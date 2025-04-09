const express = require('express');
const cors = require('cors'); // Import cors
const compression = require('compression'); // Import compression
const { PORT } = require('./config/config');
const cityRoutes = require('./routes/cityRoutes');


const app = express();

// --- Middleware ---
// Enable CORS for all origins (adjust in production if needed)
// Use this if your frontend (browser) is on a different domain than your API
app.use(cors());

// Compress all responses
app.use(compression());

// Body parsing middleware (add if you plan POST/PUT requests with JSON bodies later)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/cities', cityRoutes);


// --- Basic Root Route (Optional - Good for Health Checks) ---
app.get('/', (req, res) => {
  res.send('City API is running!');
});

// --- Error Handling (Basic Example - Add more specific handlers if needed) ---
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});


// --- Start Server ---
// Check if PORT is correctly loaded
if (!PORT) {
  console.error("Error: PORT configuration is missing!");
  process.exit(1); // Exit if the port isn't defined
}

app.listen(PORT, () => {
  console.log(`Server running at http://wide-eyed-wombat-uw8kkk488gsw0ss4o0g4s008:${PORT}`);
  // Explicitly log the port being used, helpful for debugging deployments
  console.log(`Effective PORT configured for listening: ${PORT}`);
});

// Export app (optional, sometimes useful for testing)
module.exports = app;