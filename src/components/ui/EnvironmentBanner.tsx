import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

import { config } from '../../config/env';

interface EnvironmentBannerProps {
  children: React.ReactNode;
}

const EnvironmentBanner: React.FC<EnvironmentBannerProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show banner for local and dev environments
    if (config.environment === 'local' || config.environment === 'dev' || config.environment === 'development') {
      setIsVisible(true);
    }
  }, []);

  // Update body class when banner visibility changes
  useEffect(() => {
    const shouldShowBanner = isVisible && config.environment !== 'prod';
    if (shouldShowBanner) {
      document.body.classList.add('has-env-banner');
    } else {
      document.body.classList.remove('has-env-banner');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('has-env-banner');
    };
  }, [isVisible]);

  const getBannerConfig = () => {
    switch (config.environment) {
      case 'local':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-black',
          icon: <FaExclamationTriangle className="h-3 w-3" />,
          text: 'LOCAL ENVIRONMENT - You are running on localhost',
        };
      case 'dev':
      case 'development':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          icon: <FaInfoCircle className="h-3 w-3" />,
          text: 'DEV ENVIRONMENT - You are running on development server',
        };
      default:
        return null;
    }
  };

  // Always render children, but conditionally show banner
  const shouldShowBanner = isVisible && config.environment !== 'prod';
  const bannerConfig = getBannerConfig();

  return (
    <div className="min-h-screen">
      {/* Environment Banner - Fixed at top */}
      {shouldShowBanner && bannerConfig && (
        <div className={`env-banner fixed top-0 left-0 right-0 z-[60] ${bannerConfig.bgColor} ${bannerConfig.textColor} px-3 py-1 text-xs font-medium animate-slide-down`}>
          <div className="flex items-center justify-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              {bannerConfig.icon}
              <span>{bannerConfig.text}</span>
            </div>
          </div>
        </div>
      )}

      {/* App Content with top padding when banner is visible */}
      <div className={shouldShowBanner ? 'pt-6' : ''}>{children}</div>
    </div>
  );
};

export default EnvironmentBanner;
