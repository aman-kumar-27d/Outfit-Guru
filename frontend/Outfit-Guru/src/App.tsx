import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import OutfitDetector from "./components/OutfitDetector";
import { OutfitDetectorV2 } from "./components/V2";
import VersionSwitcher from "./components/VersionSwitcher";
import VersionNotification from "./components/VersionNotification";
import Features from "./components/Features";
import About from "./components/About";
import Contact from "./components/Contact";
import { DevPage } from "./devcomponents";

function App() {
  const [detectorVersion, setDetectorVersion] = useState<'v1' | 'v2'>('v1');
  const [showNotification, setShowNotification] = useState(false);
  const [lastSwitchedVersion, setLastSwitchedVersion] = useState<'v1' | 'v2' | null>(null);
  const [showVersionSwitcher, setShowVersionSwitcher] = useState(true);

  // Handle scroll to show/hide version switcher
  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        // Show switcher when at least 50% of home section is visible
        const homeVisible = rect.bottom > window.innerHeight * 0.5 && rect.top < window.innerHeight * 0.5;
        setShowVersionSwitcher(homeVisible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleVersionChange = (version: 'v1' | 'v2') => {
    if (version !== detectorVersion) {
      setDetectorVersion(version);
      setLastSwitchedVersion(version);
      setShowNotification(true);
    }
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setLastSwitchedVersion(null);
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Version Switch Notification */}
        {showNotification && lastSwitchedVersion && (
          <VersionNotification 
            version={lastSwitchedVersion}
            onClose={handleNotificationClose}
          />
        )}
        
        <Routes>
          {/* Developer route */}
          <Route path="/dev" element={<DevPage />} />
          
          {/* Main application routes */}
          <Route path="/*" element={
            <>
              <Header currentVersion={detectorVersion} />
              <Navbar currentVersion={detectorVersion} />
              
              {/* Version Switcher */}
              <VersionSwitcher 
                currentVersion={detectorVersion}
                onVersionChange={handleVersionChange}
                isVisible={showVersionSwitcher}
              />
              
              {/* Main content area */}
              <main className="pt-16">
                <section id="home" className="min-h-screen">
                  <Home currentVersion={detectorVersion} />
                </section>
                
                {/* Conditionally render the appropriate detector version */}
                {detectorVersion === 'v1' ? <OutfitDetector /> : <OutfitDetectorV2 />}
                
                <Features />
                <About />
                <Contact />
              </main>

              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
