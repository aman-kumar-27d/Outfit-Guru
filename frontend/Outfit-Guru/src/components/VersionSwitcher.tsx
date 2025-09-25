import React from 'react';
import { Settings, Zap, ChevronDown } from 'lucide-react';

interface VersionSwitcherProps {
  currentVersion: 'v1' | 'v2';
  onVersionChange: (version: 'v1' | 'v2') => void;
  isVisible?: boolean;
}

export default function VersionSwitcher({ currentVersion, onVersionChange, isVisible = true }: VersionSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const versions = [
    {
      value: 'v1' as const,
      label: 'Version 1 (Stable)',
      description: 'Classic detection with proven reliability',
      icon: Settings,
      color: 'blue'
    },
    {
      value: 'v2' as const,
      label: 'Version 2 (Enhanced)',
      description: 'Advanced detection with enhanced colors',
      icon: Zap,
      color: 'purple'
    }
  ];

  const currentVersionData = versions.find(v => v.value === currentVersion);
  const CurrentIcon = currentVersionData?.icon || Settings;

  return (
    <div className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-full pointer-events-none'
    }`}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-200 ${
            currentVersion === 'v2' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <CurrentIcon className="w-4 h-4" />
          <span className="font-medium">{currentVersionData?.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
              <div className="p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Choose Detection Version</h3>
              </div>
              
              <div className="p-2">
                {versions.map((version) => {
                  const Icon = version.icon;
                  const isSelected = currentVersion === version.value;
                  
                  return (
                    <button
                      key={version.value}
                      onClick={() => {
                        onVersionChange(version.value);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        isSelected 
                          ? `${version.color === 'purple' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border`
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          version.color === 'purple' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-gray-900">{version.label}</h4>
                            {isSelected && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                version.color === 'purple' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{version.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600">
                <p><strong>V1:</strong> Uses /detect endpoint (stable)</p>
                <p><strong>V2:</strong> Uses /detect-v2 endpoint (enhanced features)</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}