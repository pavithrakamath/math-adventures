import React from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Trophy, Settings, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NavigationProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  backLabel?: string;
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  showBackButton = false,
  onBackClick,
  backLabel = 'Back',
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, path: '/lessons' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.nav
      className={`bg-white shadow-lg border-b border-gray-200 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Back Button */}
          {showBackButton && (
            <motion.button
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">{backLabel}</span>
            </motion.button>
          )}

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right side - could add user profile or other actions */}
          <div className="flex items-center">
            {/* Placeholder for future user menu or other actions */}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
