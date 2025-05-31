const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file for all routes (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  
  // Read the HTML file and inject the built JavaScript
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // For development, we'll serve the source files directly
  html = html.replace('%PUBLIC_URL%', '');
  
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});