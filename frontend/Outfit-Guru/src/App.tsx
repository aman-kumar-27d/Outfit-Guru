import React, { useState, useEffect } from 'react';
import HeaderWithDocs from "./components/HeaderWithDocs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import OutfitDetector from "./components/OutfitDetector";
import Features from "./components/Features";
import About from "./components/About";
import Contact from "./components/Contact";
import { DocsRouter } from "./docs";

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState('/');

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      setCurrentRoute(path);
    };

    // Handle initial route
    handleRouteChange();

    // Listen for browser navigation
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Simple client-side routing
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  // Documentation route handler
  if (currentRoute.startsWith('/docs')) {
    return <DocsRouter currentPath={currentRoute} />;
  }

  // Main application
  return (
    <div className="min-h-screen">
      <HeaderWithDocs navigate={navigate} />
      <Navbar />
      
      {/* Main content area */}
      <main className="pt-16">
        <section id="home" className="min-h-screen">
          <Home />
        </section>
        <OutfitDetector />
        <Features />
        <About />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;