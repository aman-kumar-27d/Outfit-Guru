export interface DetectionResult {
  width: number;
  height: number;
  raw_detections: Detection[];
  filtered_detections: Detection[];
  refined_detections: Detection[];
  person_regions: PersonRegion[];
}

export interface Detection {
  source_model: string;
  label: string;
  bbox: number[];
  confidence: number;
  refined_label: string;
  refined_confidence: number;
  colors: Color[];
}

export interface Color {
  rgb: number[];
  hex: string;
}

export interface PersonRegion {
  person_bbox: number[];
  regions: {
    top: Region;
    bottom: Region;
    shoes: Region;
  };
}

export interface Region {
  bbox: number[];
  dominant_color_rgb: number[];
  dominant_color_hex: string;
}

export interface RequestInfo {
  endpoint: string;
  method: string;
  timestamp: Date;
  responseTime?: number;
  fileName?: string;
  fileSize?: number;
}