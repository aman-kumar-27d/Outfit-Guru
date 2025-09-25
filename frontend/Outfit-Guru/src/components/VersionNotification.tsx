import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface VersionNotificationProps {
  version: 'v1' | 'v2';
  onClose: () => void;
}

export default function VersionNotification({ version, onClose }: VersionNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        version === 'v2' 
          ? 'bg-purple-600 text-white' 
          : 'bg-blue-600 text-white'
      }`}>
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">
          Switched to {version === 'v2' ? 'Enhanced Version 2' : 'Stable Version 1'}
        </span>
        <button
          onClick={handleClose}
          className="ml-2 p-1 hover:bg-white/20 rounded transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}