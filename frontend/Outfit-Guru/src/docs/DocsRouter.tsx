import React from 'react';
import DocLayout from './components/DocLayout';
import IntroductionPage from './pages/IntroductionPage';
import InstallationPage from './pages/InstallationPage';
import QuickStartPage from './pages/QuickStartPage';
import OutfitDetectionPage from './pages/OutfitDetectionPage';

// Placeholder pages for other documentation sections
const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="prose prose-gray max-w-none">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-xl text-gray-600 mb-8">{description}</p>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <p className="text-blue-800">
        📝 This documentation section is currently under development. 
        Check back soon for comprehensive guides and examples!
      </p>
    </div>
  </div>
);

interface DocsRouterProps {
  currentPath: string;
}

const DocsRouter: React.FC<DocsRouterProps> = ({ currentPath }) => {
  const renderPage = () => {
    switch (currentPath) {
      case '/docs':
      case '/docs/':
        return <IntroductionPage />;
      
      case '/docs/installation':
        return <InstallationPage />;
      
      case '/docs/quick-start':
        return <QuickStartPage />;
      
      case '/docs/project-structure':
        return (
          <PlaceholderPage 
            title="Project Structure" 
            description="Understanding the codebase organization and architecture"
          />
        );
      
      case '/docs/outfit-detection':
        return <OutfitDetectionPage />;
      
      case '/docs/style-analysis':
        return (
          <PlaceholderPage 
            title="Style Analysis" 
            description="AI-powered outfit style analysis and fashion insights"
          />
        );
      
      case '/docs/recommendations':
        return (
          <PlaceholderPage 
            title="Recommendations" 
            description="Personalized outfit suggestions and styling advice"
          />
        );
      
      case '/docs/face-blur':
        return (
          <PlaceholderPage 
            title="Face Blur" 
            description="Privacy protection with intelligent face blurring technology"
          />
        );
      
      case '/docs/api/backend':
        return (
          <PlaceholderPage 
            title="Backend API" 
            description="Complete backend API documentation and reference"
          />
        );
      
      case '/docs/api/endpoints':
        return (
          <PlaceholderPage 
            title="API Endpoints" 
            description="Available API endpoints, parameters, and response formats"
          />
        );
      
      case '/docs/api/models':
        return (
          <PlaceholderPage 
            title="Data Models" 
            description="API data models, schemas, and type definitions"
          />
        );
      
      case '/docs/components':
        return (
          <PlaceholderPage 
            title="Component Overview" 
            description="UI component library and design system documentation"
          />
        );
      
      case '/docs/components/upload':
        return (
          <PlaceholderPage 
            title="Upload Component" 
            description="Image upload component with drag-and-drop functionality"
          />
        );
      
      case '/docs/components/detection':
        return (
          <PlaceholderPage 
            title="Detection Components" 
            description="Outfit detection UI components and interfaces"
          />
        );
      
      case '/docs/components/results':
        return (
          <PlaceholderPage 
            title="Results Components" 
            description="Components for displaying detection results and analysis"
          />
        );
      
      case '/docs/deployment/docker':
        return (
          <PlaceholderPage 
            title="Docker Deployment" 
            description="Deploy Outfit Guru using Docker containers"
          />
        );
      
      case '/docs/deployment/production':
        return (
          <PlaceholderPage 
            title="Production Deployment" 
            description="Production deployment guide and best practices"
          />
        );
      
      case '/docs/deployment/environment':
        return (
          <PlaceholderPage 
            title="Environment Variables" 
            description="Configuration and environment setup for different environments"
          />
        );
      
      case '/docs/contributing':
        return (
          <PlaceholderPage 
            title="Contributing Guidelines" 
            description="How to contribute to the Outfit Guru project"
          />
        );
      
      case '/docs/development-setup':
        return (
          <PlaceholderPage 
            title="Development Setup" 
            description="Setting up the development environment for contributors"
          />
        );
      
      case '/docs/code-style':
        return (
          <PlaceholderPage 
            title="Code Style Guide" 
            description="Code formatting, style guidelines, and best practices"
          />
        );
      
      default:
        return (
          <div className="prose prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The documentation page you're looking for doesn't exist.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-amber-800">
                🔍 The page "{currentPath}" could not be found. 
                Please check the URL or navigate back to the{' '}
                <a href="/docs" className="text-blue-600 hover:underline">
                  documentation home
                </a>.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DocLayout currentPath={currentPath}>
      {renderPage()}
    </DocLayout>
  );
};

export default DocsRouter;