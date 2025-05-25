// Simple script to copy blog files from src/content/blogs to public/content/blogs
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../src/content/blogs');
const destDir = path.join(__dirname, '../public/content/blogs');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Get all markdown files from source directory
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.md'));

if (files.length === 0) {
  console.log('No markdown files found in source directory.');
  process.exit(0);
}

// Copy each file to destination
files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied: ${file}`);
});

console.log(`Successfully copied ${files.length} blog file(s) to ${destDir}`); 