import { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

interface HeaderProps {
  navigate?: (path: string) => void;
  currentVersion?: 'v1' | 'v2';
}

const Header: React.FC<HeaderProps> = ({ navigate, currentVersion = 'v1' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get the theme color based on version
  const hoverTextColor = currentVersion === 'v2' ? 'hover:text-purple-600' : 'hover:text-blue-600';
  const buttonBgColor = currentVersion === 'v2' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';
  const logoAccentColor = currentVersion === 'v2' ? 'text-purple-600' : 'text-blue-600';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    if (navigate) {
      navigate(path);
    } else {
      // Fallback for direct URL navigation
      window.location.href = path;
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (window.location.pathname.startsWith('/docs')) {
      handleNavigation('/');
    } else {
      scrollToSection('home');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={handleLogoClick}
              className={`text-2xl font-bold text-gray-900 ${hoverTextColor} transition-colors`}
            >
              Outfit<span className={`transition-colors duration-300 ${logoAccentColor}`}>Guru</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                if (window.location.pathname.startsWith('/docs')) {
                  handleNavigation('/');
                } else {
                  scrollToSection('home');
                }
              }}
              className={`text-gray-700 ${hoverTextColor} transition-colors duration-200 font-medium`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`text-gray-700 ${hoverTextColor} transition-colors duration-200 font-medium`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-gray-700 ${hoverTextColor} transition-colors duration-200 font-medium`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-gray-700 ${hoverTextColor} transition-colors duration-200 font-medium`}
            >
              Contact
            </button>
            <button
              onClick={() => handleNavigation('/docs')}
              className={`flex items-center space-x-1 text-gray-700 ${hoverTextColor} transition-colors duration-200 font-medium`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => scrollToSection('home')}
              className={`${buttonBgColor} text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200`}
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`text-gray-700 ${hoverTextColor} transition-colors duration-200`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button
                onClick={() => {
                  if (window.location.pathname.startsWith('/docs')) {
                    handleNavigation('/');
                  } else {
                    scrollToSection('home');
                  }
                }}
                className={`block w-full text-left px-3 py-2 text-gray-700 ${hoverTextColor} hover:bg-gray-50 rounded-md font-medium transition-colors duration-200`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`block w-full text-left px-3 py-2 text-gray-700 ${hoverTextColor} hover:bg-gray-50 rounded-md font-medium transition-colors duration-200`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`block w-full text-left px-3 py-2 text-gray-700 ${hoverTextColor} hover:bg-gray-50 rounded-md font-medium transition-colors duration-200`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`block w-full text-left px-3 py-2 text-gray-700 ${hoverTextColor} hover:bg-gray-50 rounded-md font-medium transition-colors duration-200`}
              >
                Contact
              </button>
              <button
                onClick={() => handleNavigation('/docs')}
                className={`flex items-center space-x-2 w-full text-left px-3 py-2 text-gray-700 ${hoverTextColor} hover:bg-gray-50 rounded-md font-medium transition-colors duration-200`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Documentation</span>
              </button>
              <div className="px-3 py-2">
                <button 
                  onClick={() => scrollToSection('home')}
                  className={`w-full ${buttonBgColor} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;