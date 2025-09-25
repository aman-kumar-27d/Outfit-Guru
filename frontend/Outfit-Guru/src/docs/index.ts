// Main documentation exports
export { default as DocsRouter } from './DocsRouter';
export { default as DocLayout } from './components/DocLayout';

// Component exports
export { default as CodeBlock, InlineCode } from './components/CodeBlock';
export { default as ImagePreview, ImageGrid } from './components/ImagePreview';
export { default as Callout } from './components/Callout';

// Page exports
export { default as IntroductionPage } from './pages/IntroductionPage';
export { default as InstallationPage } from './pages/InstallationPage';
export { default as QuickStartPage } from './pages/QuickStartPage';
export { default as OutfitDetectionPage } from './pages/OutfitDetectionPage';

// Data exports
export { docsConfig, type DocItem, type SidebarNavItem } from './data/navigation';

// Utility function to get the current documentation route
export const getCurrentDocRoute = (): string => {
  if (typeof window === 'undefined') return '/docs';
  
  const path = window.location.pathname;
  if (path.startsWith('/docs')) {
    return path;
  }
  
  return '/docs';
};

// Utility function to check if current route is a docs route
export const isDocsRoute = (path?: string): boolean => {
  const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  return currentPath.startsWith('/docs');
};