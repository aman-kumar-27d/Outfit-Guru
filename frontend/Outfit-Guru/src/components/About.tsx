const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About OutfitGuru</h2>
            <p className="text-xl text-gray-600">
              Revolutionizing the way you dress with artificial intelligence
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                At OutfitGuru, we believe that everyone deserves to look and feel their best. Our AI-powered 
                platform combines cutting-edge technology with fashion expertise to provide personalized 
                styling solutions that fit your lifestyle, budget, and preferences.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're preparing for a job interview, planning a weekend getaway, or just looking 
                to refresh your everyday style, OutfitGuru is here to guide you every step of the way.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">✨</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Style Made Simple</h4>
                <p className="text-gray-600">
                  Transform your wardrobe with intelligent recommendations tailored just for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;