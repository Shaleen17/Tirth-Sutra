# Reorganize Project Structure

The project currently has a disconnected structure, with inconsistencies between the main site, `Social_Media`, and `T-Virasat`. To make it clean and scalable and eliminate future broken link issues, we will adopt a **centralized assets architecture** and standard modular folders.

## User Review Required

Please review the proposed structure. This will centralize all CSS, JS, and Data into a global `assets/` directory while keeping HTML pages organized by domain (`pages/`, `social/`, `shop/`). 

> [!WARNING]
> This restructuring will modify links in all 38 HTML files to ensure they point to the correct new paths. I will write a script to surgically update the links without breaking any code.

## Proposed Changes

### 1. Directory Restructuring

We will restructure the layout to look like this:

```text
The Puranic Path/
├── index.html (Main Entry)
├── pages/
│   └── (All 31 existing main site HTML files stay here)
├── social/
│   └── index.html (Moved from Social_Media/index.html)
├── shop/
│   ├── artisan.html (Moved from T-Virasat/artisan.html)
│   ├── dashboard.html (Moved from T-Virasat/dashboard.html)
│   ├── marketplace.html (Moved from T-Virasat/marketplace.html)
│   └── sutra.html (Moved from T-Virasat/sutra.html)
└── assets/
    ├── css/
    │   ├── main.css (Renamed from assets/css/style.css)
    │   ├── social.css (Moved from Social_Media/assets/css/Style.css)
    │   └── shop.css (Moved from T-Virasat/assets/css/style1.css)
    ├── js/
    │   ├── main/
    │   │   ├── script.js
    │   │   └── scriptx.js
    │   ├── social/
    │   │   └── script.js (Moved from Social_Media/assets/js/Script.js)
    │   └── shop/
    │       ├── auth.js (Moved from T-Virasat/js/auth.js)
    │       ├── cart.js (Moved from T-Virasat/js/cart.js)
    │       ├── products.js (Moved from T-Virasat/js/products.js)
    │       └── storage.js (Moved from T-Virasat/js/storage.js)
    ├── data/
    │   └── shop_data.js (Moved from T-Virasat/data/seedData.js)
    └── images/
        └── (Any existing images)
```

### 2. File Link Updates
I will use a Node.js script to automatically find and replace all instances of:
- `Social_Media/` references
- `T-Virasat/` references
- [assets/css/style.css](file:///c:/Users/User/Desktop/The%20Puranic%20Path/assets/css/style.css) -> `assets/css/main.css`
- [assets/css/Style.css](file:///c:/Users/User/Desktop/The%20Puranic%20Path/assets/css/Style.css) -> `assets/css/social.css`
- `assets/css/style1.css` -> `assets/css/shop.css`
- and JS file imports across all `*.html` and `*.js` files.

This ensures zero broken links.

### 3. Deleting Unused/Empty Folders
We will safely delete `ImagesM`, `images` (at root, if empty), and the old `Social_Media` and `T-Virasat` directories after moving their contents.

## Verification Plan

### Automated Verification
- I will run a script to verify that no HTML files contain the old strings (`Social_Media/`, `T-Virasat/`, [style1.css](file:///c:/Users/User/Desktop/The%20Puranic%20Path/T-Virasat/assets/css/style1.css), etc.)
- Use `find_by_name` to ensure all files were successfully moved to their target directories.

### Manual Verification
- You can open [index.html](file:///c:/Users/User/Desktop/The%20Puranic%20Path/index.html) in your browser.
- Navigate to the Social Media platform (`social/index.html`) and check if styles load correctly.
- Navigate to the Shop platform (`shop/sutra.html`) and verify functionality.
