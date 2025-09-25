import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Callout: React.FC<CalloutProps> = ({ 
  type = 'info', 
  title, 
  children, 
  className = '' 
}) => {
  const configs = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    tip: {
      icon: Lightbulb,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      textColor: 'text-purple-800'
    }
  };

  const config = configs[type];
  const IconComponent = config.icon;

  return (
    <div className={`border rounded-lg p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textColor} prose prose-sm max-w-none`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;