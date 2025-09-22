const Features = () => {
  return (
    <section id="features" className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make OutfitGuru your perfect fashion companion
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-600">Get personalized outfit suggestions based on your style preferences and body type.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👗</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Virtual Wardrobe</h3>
            <p className="text-gray-600">Organize and manage your clothes digitally with our smart wardrobe system.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Ready</h3>
            <p className="text-gray-600">Access your style assistant anywhere with our responsive mobile design.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;