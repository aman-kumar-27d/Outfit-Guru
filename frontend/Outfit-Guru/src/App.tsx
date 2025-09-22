import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import OutfitDetector from "./components/OutfitDetector";
import Features from "./components/Features";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  return (
    <div className="min-h-screen">

      <Header />
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
}

export default App;
