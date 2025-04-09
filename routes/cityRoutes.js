const express = require('express');
const router = express.Router();
const { CITIES } = require('../config/config'); // Correct path assuming config is one level up

// GET /api/cities - Get all cities formatted
router.get('/', (req, res, next) => { // Added next for potential error forwarding
  try {
    const formattedCities = Object.entries(CITIES).reduce((acc, [country, cities]) => {
      // Keep original format as { name: 'City', code: 'CC' } - often more useful for clients
      // acc[country] = cities.map(city => ({ name: city.name, code: city.code }));
      // Or use the string format if preferred:
      acc[country] = cities.map(city => `${city.name} - ${city.code}`);
      return acc;
    }, {});
    res.json({
      success: true,
      data: formattedCities
    });
  } catch (error) {
    // Pass error to the central error handler in server.js
    next(error);
    // Or handle directly: res.status(500).json({ success: false, error: 'Failed to fetch cities' });
  }
});

// GET /api/cities/search?q=... - Search cities
router.get('/search', (req, res, next) => { // Added next
  try {
    const { q } = req.query;
    // Improved validation slightly
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required and must not be empty' });
    }

    const searchTerm = q.toLowerCase().trim();
    const results = [];

    Object.entries(CITIES).forEach(([country, cities]) => {
      const matches = cities
        .filter(city => city.name.toLowerCase().includes(searchTerm))
        // Keep original format { name: 'City', code: 'CC' }
        // .map(city => ({ name: city.name, code: city.code }));
        // Or use the string format:
         .map(city => `${city.name} - ${city.code}`);

      if (matches.length > 0) {
        // Return structure as { country: 'CountryName', cities: [ ...matches ] }
        // results.push({ country, cities: matches });
        // Or flatten if preferred (easier for simple lists):
         results.push(...matches); // Add matched city strings directly to results array
      }
    });

    // Decide on the output structure for search results.
    // Option 1: Grouped by country (as originally coded)
    // const outputData = [];
    // Object.entries(CITIES).forEach(([country, cities]) => {
    //     const matches = cities
    //         .filter(city => city.name.toLowerCase().includes(searchTerm))
    //         .map(city => `${city.name} - ${city.code}`); // Or map(city => ({ name: city.name, code: city.code }))
    //     if (matches.length > 0) {
    //         outputData.push({ country, cities: matches });
    //     }
    // });

    // Option 2: Flattened list (simpler response)
    const flatResults = [];
     Object.values(CITIES).forEach(cities => {
        cities.forEach(city => {
            if (city.name.toLowerCase().includes(searchTerm)) {
                flatResults.push(`${city.name} - ${city.code}`); // Or { name: city.name, code: city.code }
            }
        });
     });


    res.json({
      success: true,
      // data: outputData // Use if you want results grouped by country
      data: flatResults // Use if you want a flat list of matching city strings/objects
    });
  } catch (error) {
     // Pass error to the central error handler
     next(error);
     // Or handle directly: res.status(500).json({ success: false, error: 'Failed to search cities' });
  }
});

module.exports = router;