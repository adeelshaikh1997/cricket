import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  Target, 
  BarChart3, 
  Activity,
  User
} from 'lucide-react';

const Layout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Match Predictor',
      icon: Target,
      description: 'Predict match outcomes'
    },
    {
      path: '/insights',
      label: 'Cricket Insights',
      icon: BarChart3,
      description: 'Explore cricket analytics'
    },
    {
      path: '/player-analysis',
      label: 'Player Deep Dive',
      icon: User,
      description: 'Analyze cricket players'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-cricket-green-200 dark:border-cricket-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-cricket-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Cricklytics
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-cricket-green-600 bg-cricket-green-50 dark:bg-cricket-green-900 dark:text-cricket-green-300'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-cricket-green-600 bg-cricket-green-50 dark:bg-cricket-green-900 dark:text-cricket-green-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-cricket-green-600 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 Cricklytics. Powered by SportMonks API.
              </span>
            </div>
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Made with 🏏 for cricket analytics
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 