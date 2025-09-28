import fs from 'fs';
import path from 'path';

const distDir = path.resolve('./dist');
const pagesDir = path.join(distDir, 'pages');

// Function to move a file from source to destination
function moveFile(src, dest) {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(src, dest);
  } catch (error) {
  }
}

// Function to remove empty directory
function removeEmptyDir(dir) {
  try {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        fs.rmdirSync(dir);
      }
    }
  } catch (error) {
  }
}

// Check if pages directory exists
if (!fs.existsSync(pagesDir)) {
  process.exit(1);
}

// Move index.html from pages/ to root
const sourceIndex = path.join(pagesDir, 'index.html');
const destIndex = path.join(distDir, 'index.html');
if (fs.existsSync(sourceIndex)) {
  moveFile(sourceIndex, destIndex);
}

// Move not-found.html from pages/ to root  
const sourceNotFound = path.join(pagesDir, 'not-found.html');
const destNotFound = path.join(distDir, 'not-found.html');
if (fs.existsSync(sourceNotFound)) {
  moveFile(sourceNotFound, destNotFound);
}

// Move portal/index.html from pages/portal/ to portal/
const sourcePortal = path.join(pagesDir, 'portal', 'index.html');
const destPortal = path.join(distDir, 'portal', 'index.html');
if (fs.existsSync(sourcePortal)) {
  moveFile(sourcePortal, destPortal);
}

// Clean up empty directories
removeEmptyDir(path.join(pagesDir, 'portal')); // Remove pages/portal if empty
removeEmptyDir(pagesDir); // Remove pages if empty