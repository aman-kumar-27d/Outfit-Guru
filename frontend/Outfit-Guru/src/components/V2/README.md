# OutfitDetector V2

This directory contains the updated version of OutfitDetector that handles the new server response format from the `/detect` endpoint.

## Changes in V2

### New Server Response Format
The `/detect` endpoint now returns a more comprehensive response with:
- `raw_detections`: All initial detections
- `filtered_detections`: Filtered detections based on confidence/quality
- `refined_detections`: Final refined detections with improved labels
- `person_regions`: Enhanced person region analysis with RGB and hex colors

### Key Improvements
1. **Enhanced Color Support**: Multiple colors per detection with both RGB and hex values
2. **Better Detection Quality**: Uses refined detections for improved accuracy
3. **Backward Compatibility**: Maintains compatibility with existing `/analyze` endpoint
4. **Dual Format Storage**: Stores both new and legacy formats for flexibility

### Data Conversion
The component automatically converts the new server response format to the legacy format expected by the `/analyze` endpoint:

```javascript
// New format example
{
  source_model: "fashion",
  label: "bags",
  refined_label: "bags",
  refined_confidence: 0.9,
  colors: [
    { rgb: [176, 159, 133], hex: "#b09f85" },
    { rgb: [48, 42, 35], hex: "#302a23" }
  ],
  bbox: [154, 332, 258, 480]
}

// Converted to legacy format
{
  label: "bags",
  confidence: 0.9,
  dominant_color_hex: "#b09f85",
  source_model: "fashion",
  bbox: [154, 332, 258, 480]
}
```

### Usage
Import and use just like the original component:

```tsx
import { OutfitDetectorV2 } from './components/V2';

function App() {
  return <OutfitDetectorV2 />;
}
```

## Compatibility
- ✅ Works with new `/detect` endpoint format
- ✅ Compatible with existing `/analyze` endpoint
- ✅ Maintains all existing functionality
- ✅ Enhanced color display with multiple color support