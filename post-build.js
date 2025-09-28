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
    console.log(`Moved: ${path.relative(distDir, src)} → ${path.relative(distDir, dest)}`);
  } catch (error) {
    console.error(`Error moving ${src} to ${dest}:`, error.message);
  }
}

// Function to remove empty directory
function removeEmptyDir(dir) {
  try {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir);
      if (files.length === 0) {
        fs.rmdirSync(dir);
        console.log(`Removed empty directory: ${path.relative(distDir, dir)}`);
      }
    }
  } catch (error) {
    console.error(`Error removing directory ${dir}:`, error.message);
  }
}

console.log('🔧 Post-build: Restructuring HTML output files...');

// Check if pages directory exists
if (!fs.existsSync(pagesDir)) {
  console.log('❌ Pages directory not found. Build may have failed.');
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

console.log('✅ Post-build: HTML file restructuring completed!');
console.log('📁 Final structure:');
console.log('   /dist/index.html');
console.log('   /dist/portal/index.html');
console.log('   /dist/not-found.html');