import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  showZoom?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt,
  caption,
  className = '',
  showZoom = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (showZoom) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`relative group ${className}`}>
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto ${showZoom ? 'cursor-zoom-in' : ''}`}
            onClick={openModal}
          />
          
          {showZoom && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white bg-opacity-90 rounded-full p-2">
                  <ZoomIn className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {caption && (
          <p className="mt-2 text-sm text-gray-600 text-center italic">
            {caption}
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div className="relative max-w-screen-lg max-h-screen p-4">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 p-2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full transition-colors"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {caption && (
              <p className="mt-4 text-white text-center text-sm">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

interface ImageGridProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  columns = 2,
  className = ''
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {images.map((image, index) => (
        <ImagePreview
          key={index}
          src={image.src}
          alt={image.alt}
          caption={image.caption}
        />
      ))}
    </div>
  );
};

export default ImagePreview;