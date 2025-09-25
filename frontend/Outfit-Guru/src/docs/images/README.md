# Documentation Images

This folder contains all images used in the documentation system. Follow strict naming conventions and guidelines below.

## 📁 Folder Structure

```
src/docs/images/
├── README.md                    # This file
├── homepage/                    # Homepage screenshots
├── detection/                   # Detection examples and UI
├── installation/               # Installation process screenshots  
├── components/                 # Component examples
├── api/                       # API response examples
├── features/                  # Feature demonstrations
└── misc/                      # Miscellaneous images
```

## 🏷️ Naming Convention (STRICT)

Follow this exact naming pattern:

### **Format**: `[category]_[description]_[size]_[variant].ext`

**Examples:**
- `homepage_dashboard_800x500_light.png`
- `detection_example_result_1200x800_annotated.jpg`
- `installation_step1_terminal_600x400_windows.png`
- `api_response_json_800x600_formatted.png`

### **Categories:**
- `homepage` - Main application screenshots
- `detection` - Outfit detection examples and results
- `installation` - Setup and installation screens
- `quickstart` - Quick start tutorial images
- `components` - UI component examples
- `api` - API documentation visuals
- `features` - Feature demonstrations
- `architecture` - System architecture diagrams
- `deployment` - Deployment process images
- `misc` - Other documentation images

### **Sizes (Standard):**
- `400x300` - Small thumbnails
- `600x400` - Medium images  
- `800x500` - Large images (recommended)
- `1200x800` - Extra large/detailed images
- `800x600` - Square-ish images
- `1920x1080` - Full screenshots

### **Variants (Optional):**
- `_light` / `_dark` - Theme variants
- `_annotated` - With arrows/labels
- `_clean` - Without annotations
- `_mobile` - Mobile view
- `_desktop` - Desktop view
- `_before` / `_after` - Comparison images

## 🔄 How to Replace Placeholder Images

### Step 1: Identify the Placeholder
Look for images in documentation pages with paths like:
```typescript
src="/docs/images/[placeholder_name]"
```

### Step 2: Prepare Your Image
1. **Resize** your image to match the expected dimensions
2. **Optimize** for web (compress to reasonable file size)
3. **Name** following the strict convention above
4. **Format** should be PNG for screenshots, JPG for photos

### Step 3: Replace the File
1. **Save** your image to the appropriate subfolder
2. **Update** the import path in the documentation page
3. **Test** the image displays correctly

### Step 4: Update Documentation
If you change image names, update the corresponding documentation page:

```typescript
// Before
<ImagePreview src="/docs/images/PLACEHOLDER_homepage_dashboard.png" />

// After  
<ImagePreview src="/docs/images/homepage/homepage_dashboard_800x500_light.png" />
```

## 📋 Image Requirements

### **Technical Specs:**
- **Max file size**: 2MB per image
- **Formats**: PNG (preferred), JPG, WebP
- **Min resolution**: 400x300
- **Max resolution**: 1920x1080
- **Aspect ratio**: Maintain reasonable ratios (16:9, 4:3, 3:2)

### **Quality Guidelines:**
- **Clear text**: Ensure all text is readable
- **High contrast**: Good visibility for all users
- **No sensitive info**: Remove any personal/confidential data
- **Consistent style**: Match existing documentation style
- **Alt text ready**: Images should be self-explanatory

## 🖼️ Image Usage in Components

### ImagePreview Component
```typescript
<ImagePreview
  src="/docs/images/detection/detection_example_result_800x500_annotated.jpg"
  alt="Outfit detection results with bounding boxes and confidence scores"
  caption="Example detection output showing classified clothing items"
/>
```

### ImageGrid Component
```typescript
<ImageGrid
  images={[
    {
      src: "/docs/images/installation/installation_step1_terminal_600x400_windows.png",
      alt: "Terminal window showing npm install command",
      caption: "Step 1: Installing dependencies"
    },
    {
      src: "/docs/images/installation/installation_step2_browser_600x400_success.png", 
      alt: "Browser showing successful application start",
      caption: "Step 2: Application running successfully"
    }
  ]}
  columns={2}
/>
```

## 📂 Current Placeholder Files

These files need to be replaced with actual images:

### Homepage Section:
- `PLACEHOLDER_homepage_dashboard.png` → Replace with main dashboard screenshot
- `PLACEHOLDER_homepage_hero.png` → Replace with hero section image

### Detection Section:  
- `PLACEHOLDER_detection_example.png` → Replace with detection results example
- `PLACEHOLDER_detection_process.png` → Replace with process flow diagram
- `PLACEHOLDER_detection_models_comparison.png` → Replace with model comparison chart

### Installation Section:
- `PLACEHOLDER_installation_terminal.png` → Replace with installation terminal
- `PLACEHOLDER_installation_browser.png` → Replace with running application
- `PLACEHOLDER_installation_file_structure.png` → Replace with file explorer view

### Quick Start Section:
- `PLACEHOLDER_quickstart_upload.png` → Replace with upload interface
- `PLACEHOLDER_quickstart_results.png` → Replace with analysis results
- `PLACEHOLDER_quickstart_settings.png` → Replace with settings panel

## 🚨 Important Notes

### **DO NOT:**
- Use images with copyrighted content
- Include personal information in screenshots
- Use low-resolution or blurry images
- Ignore the naming convention
- Commit large image files (>2MB)

### **DO:**
- Compress images appropriately
- Use descriptive alt text
- Follow naming conventions strictly
- Test images on different screen sizes
- Update documentation when changing images

## 🔧 Tools for Image Optimization

### Recommended Tools:
- **TinyPNG** - Online compression
- **ImageOptim** - Mac compression tool
- **Squoosh** - Google's web-based optimizer
- **GIMP** - Free image editor
- **Canva** - For creating diagrams/illustrations

### CLI Tools:
```bash
# Install imagemin for batch optimization
npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg

# Optimize images
imagemin src/docs/images/*.{jpg,png} --out-dir=src/docs/images/optimized
```

## 🎨 Style Guidelines

### Screenshots:
- Use consistent browser/OS theme
- Hide personal bookmarks/tabs
- Use clean, organized layouts
- Highlight important UI elements

### Diagrams:
- Use consistent colors (match documentation theme)
- Clear, readable fonts
- Logical flow direction (left-to-right, top-to-bottom)
- Legend when necessary

### Code Screenshots:
- Use consistent syntax highlighting theme
- Ensure code is properly formatted
- Include relevant context
- Avoid truncated content

## 📞 Need Help?

If you need assistance with:
- Image optimization
- Creating diagrams
- Taking screenshots
- Following naming conventions

Refer to this README or create an issue in the repository.

---

**Last Updated**: September 25, 2025
**Version**: 1.0