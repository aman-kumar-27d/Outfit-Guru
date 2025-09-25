import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { docsConfig } from '../data/navigation';

interface SearchResult {
  title: string;
  href: string;
  description?: string;
  category: string;
  matches: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Create searchable content from navigation config
  const searchableContent = React.useMemo(() => {
    const content: SearchResult[] = [];
    
    docsConfig.sidebarNav.forEach((section) => {
      section.items?.forEach((item) => {
        content.push({
          title: item.title,
          href: item.href,
          description: item.description,
          category: section.title,
          matches: [
            item.title.toLowerCase(),
            item.description?.toLowerCase() || '',
            section.title.toLowerCase()
          ]
        });
      });
    });
    
    return content;
  }, []);

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = searchableContent.filter((item) =>
      item.matches.some((match) => match.includes(query))
    );

    // Sort by relevance (exact matches first, then partial matches)
    filtered.sort((a, b) => {
      const aExact = a.matches.some((match) => match === query);
      const bExact = b.matches.some((match) => match === query);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return 0;
    });

    setResults(filtered.slice(0, 8)); // Limit to 8 results
    setSelectedIndex(0);
  };

  // Handle search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].href;
            onClose();
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop with minimal blur effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal container with proper rounded corners */}
      <div className="relative w-full max-w-2xl mx-4 bg-white/95 rounded-xl shadow-2xl ring-1 ring-black/5 border border-white/20 overflow-hidden">
        {/* Glow effect behind modal */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/8 via-purple-400/8 to-blue-400/8 rounded-xl blur-md -z-10 scale-105" />
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200/50">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 text-lg bg-transparent border-none outline-none placeholder-gray-500 text-gray-900"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {results.length === 0 && query.trim() ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords or browse the navigation</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search documentation</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['installation', 'quick start', 'detection', 'API'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2 py-1 text-xs bg-white/40 hover:bg-white/60 rounded-md transition-colors border border-gray-200/30"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            results.map((result, index) => (
              <a
                key={result.href}
                href={result.href}
                onClick={onClose}
                className={`block p-4 border-b border-gray-100/30 hover:bg-white/40 transition-all duration-200 ${
                  index === selectedIndex ? 'bg-gradient-to-r from-blue-50/60 to-purple-50/60 border-blue-200/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      index === selectedIndex ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {result.title}
                    </h3>
                    {result.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                    )}
                    <span className="inline-block px-2 py-1 text-xs bg-white/40 text-gray-600 rounded-md mt-2 border border-gray-200/30">
                      {result.category}
                    </span>
                  </div>
                  {index === selectedIndex && (
                    <div className="ml-3 text-xs text-blue-600 bg-blue-100/60 px-2 py-1 rounded-md">
                      Press Enter
                    </div>
                  )}
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200/30 text-xs text-gray-500 bg-white/30">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;