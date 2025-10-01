const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); // Import file system module

const app = express();
const PORT = 8000;

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.static(__dirname));

// Handle all unmatched routes (using middleware to avoid wildcard errors)
app.use((req, res, next) => {
  // Check if the requested path corresponds to an actual existing file
  const filePath = path.join(__dirname, req.path);
  
  // Determine if the file exists
  fs.exists(filePath, (exists) => {
    if (exists) {
      // If the file exists, continue processing (returned by static middleware)
      next();
    } else {
      // If the file doesn't exist, return index.html
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server started: http://localhost:${PORT}`);
  console.log(`Please access the website through the above address`);
  console.log(`Ensure the API server is running at: http://localhost:3000`);
});