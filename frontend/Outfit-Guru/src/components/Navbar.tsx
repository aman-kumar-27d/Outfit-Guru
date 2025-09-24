import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

interface NavbarProps {
  currentVersion?: 'v1' | 'v2';
}

const Navbar = ({ currentVersion = 'v1' }: NavbarProps) => {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Theme colors based on version
  const themeColors = {
    active: currentVersion === 'v2' ? 'bg-purple-600' : 'bg-blue-600',
    hover: currentVersion === 'v2' ? 'hover:bg-purple-400' : 'hover:bg-blue-400',
    button: currentVersion === 'v2' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700',
    gradient: currentVersion === 'v2' ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-purple-600'
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 400);

      // Update active section
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Side Navigation Indicator */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? `${themeColors.active} scale-125`
                  : `bg-gray-300 ${themeColors.hover}`
              }`}
              title={item.label}
            >
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 ${themeColors.button} text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110`}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className={`h-full bg-gradient-to-r ${themeColors.gradient} transition-all duration-150 ease-out`}
          style={{
            width: `${((window.pageYOffset || document.documentElement.scrollTop) / 
              ((document.documentElement.scrollHeight || document.body.scrollHeight) - 
              document.documentElement.clientHeight)) * 100}%`,
          }}
        />
      </div>
    </>
  );
};

export default Navbar;