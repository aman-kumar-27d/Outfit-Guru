import React from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Menu, X, Home, BookOpen, Search } from 'lucide-react';
import { docsConfig, type DocItem } from '../data/navigation';
import SearchModal from './SearchModal';

interface DocLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

interface SidebarProps {
  currentPath?: string;
  onClose?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath = '', onClose, className = '' }) => {
  const isActive = (href: string) => {
    if (href === '/docs' && currentPath === '/docs') return true;
    if (href !== '/docs' && currentPath.startsWith(href)) return true;
    return false;
  };

  const renderNavItem = (item: DocItem) => (
    <a
      key={item.href}
      href={item.href}
      className={`block px-3 py-2 text-sm rounded-md transition-colors ${
        isActive(item.href)
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
      onClick={onClose}
    >
      <div className="flex items-center justify-between">
        <span>{item.title}</span>
        {item.new && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            New
          </span>
        )}
      </div>
      {item.description && (
        <p className="mt-1 text-xs text-gray-500 leading-snug">
          {item.description}
        </p>
      )}
    </a>
  );

  return (
    <div className={`bg-white border-r border-gray-200 h-full ${className}`}>
      <ScrollArea className="h-full py-6 pl-6 pr-6 lg:py-8">
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-lg font-semibold">Documentation</span>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="space-y-8">
          {docsConfig.sidebarNav.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-sm font-medium text-gray-900">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items?.map((item: DocItem) => renderNavItem(item))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const DocLayout: React.FC<DocLayoutProps> = ({ children, currentPath }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Handle keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md md:hidden"
              title="Search (⌘K)"
            >
              <Search className="h-5 w-5" />
            </button>
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">OG</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Outfit Guru</span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
            <a href="/docs" className="flex items-center space-x-1 text-sm text-blue-600 font-medium">
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </a>
            <div className="relative">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Search docs...</span>
                <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-white border border-gray-200 rounded">
                  ⌘K
                </kbd>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-16 h-[calc(100vh-4rem)]">
            <Sidebar currentPath={currentPath} />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 h-full bg-white">
              <Sidebar 
                currentPath={currentPath} 
                onClose={() => setSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </div>
  );
};

export default DocLayout;