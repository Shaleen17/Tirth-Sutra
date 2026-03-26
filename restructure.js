const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\User\\Desktop\\The Puranic Path';

// Dirs to create
const dirs = [
  'social',
  'shop',
  'assets/css',
  'assets/js/main',
  'assets/js/social',
  'assets/js/shop',
  'assets/data',
  'assets/images/social',
  'assets/images/shop'
];

dirs.forEach(d => {
  const p = path.join(rootDir, d);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

// Helper to move all files from a directory to another
function moveAllFilesInDir(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) return;
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);
    const stat = fs.statSync(srcPath);
    if (stat.isFile()) {
      fs.renameSync(srcPath, destPath);
      console.log(`Moved ${srcPath} -> ${destPath}`);
    } else if (stat.isDirectory()) {
      // Just in case there are nested directories
      const newTarget = path.join(targetDir, file);
      if (!fs.existsSync(newTarget)) fs.mkdirSync(newTarget, { recursive: true });
      moveAllFilesInDir(srcPath, newTarget);
    }
  });
}

// Move images from subprojects to global assets/images subdirectories to avoid name clashes
moveAllFilesInDir(path.join(rootDir, 'Social_Media/assets/images'), path.join(rootDir, 'assets/images/social'));
moveAllFilesInDir(path.join(rootDir, 'T-Virasat/assets/images'), path.join(rootDir, 'assets/images/shop'));

// Known files to move: [oldPath, newPath]
const moves = [
  ['social/index.html', 'social/index.html'],
  ['shop/artisan.html', 'shop/artisan.html'],
  ['shop/dashboard.html', 'shop/dashboard.html'],
  ['shop/marketplace.html', 'shop/marketplace.html'],
  ['shop/sutra.html', 'shop/sutra.html'],
  ['assets/css/main.css', 'assets/css/main.css'],
  ['Social_Media/assets/css/Style.css', 'assets/css/social.css'],
  ['T-Virasat/assets/css/style1.css', 'assets/css/shop.css'],
  ['assets/js/main/script.js', 'assets/js/main/script.js'],
  ['assets/js/main/scriptx.js', 'assets/js/main/scriptx.js'],
  ['Social_Media/assets/js/Script.js', 'assets/js/social/script.js'],
  ['T-Virasat/js/auth.js', 'assets/js/shop/auth.js'],
  ['T-Virasat/js/cart.js', 'assets/js/shop/cart.js'],
  ['T-Virasat/js/products.js', 'assets/js/shop/products.js'],
  ['T-Virasat/js/storage.js', 'assets/js/shop/storage.js'],
  ['T-Virasat/data/seedData.js', 'assets/data/shop_data.js']
];

moves.forEach(([oldP, newP]) => {
  const from = path.join(rootDir, oldP);
  const to = path.join(rootDir, newP);
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`Moved ${oldP} -> ${newP}`);
  }
});

// String replacements to run on ALL html/js files
const globalReplacements = [
  ['assets/css/main.css', 'assets/css/main.css'],
  ['assets/js/main/script.js', 'assets/js/main/script.js'],
  ['assets/js/main/scriptx.js', 'assets/js/main/scriptx.js'],
  ['social/index.html', 'social/index.html'],
  ['shop/artisan.html', 'shop/artisan.html'],
  ['shop/dashboard.html', 'shop/dashboard.html'],
  ['shop/marketplace.html', 'shop/marketplace.html'],
  ['shop/sutra.html', 'shop/sutra.html']
];

// Context-specific replacements
const socialReplacements = [
  ['assets/css/Style.css', '../assets/css/social.css'],
  ['assets/js/Script.js', '../assets/js/social/script.js'],
  ['Brand_Logo.jpg', '../assets/images/BrandLogo.jpg'], // I see social/index.html uses href="Brand_Logo.jpg", which might be the root one or its own. I'll replace it to use the main BrandLogo.jpg
  // Update image paths for social
  ['assets/images/', '../assets/images/social/']
];

const shopReplacements = [
  ['assets/css/style1.css', '../assets/css/shop.css'],
  ['js/auth.js', '../assets/js/shop/auth.js'],
  ['js/cart.js', '../assets/js/shop/cart.js'],
  ['js/products.js', '../assets/js/shop/products.js'],
  ['js/storage.js', '../assets/js/shop/storage.js'],
  ['data/seedData.js', '../assets/data/shop_data.js'],
  // Update image paths for shop
  ['assets/images/', '../assets/images/shop/']
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Global replacements
  globalReplacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });

  // Shop-specific (if file is in shop directory)
  if (filePath.includes(path.sep + 'shop' + path.sep)) {
    shopReplacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });
  }
  
  // Social-specific
  if (filePath.includes(path.sep + 'social' + path.sep)) {
    socialReplacements.forEach(([from, to]) => {
      content = content.split(from).join(to);
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated paths in ${path.relative(rootDir, filePath)}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.vscode') continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
        processFile(fullPath);
      }
    }
  }
}

processDirectory(rootDir);

// Clean up old empty folders
const foldersToDelete = ['Social_Media', 'T-Virasat', 'ImagesM', 'images'];
foldersToDelete.forEach(folder => {
  const p = path.join(rootDir, folder);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`Deleted old folder: ${folder}`);
  }
});

console.log('Restructuring complete!');
