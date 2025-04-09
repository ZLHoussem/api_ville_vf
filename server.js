// server.js
const express = require('express');
const app = express();
const { PORT} = require('./config/config');

const cityRoutes = require('./routes/cityRoutes');



app.use('/api/cities', cityRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});