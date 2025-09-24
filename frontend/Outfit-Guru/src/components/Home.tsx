
interface HomeProps {
  currentVersion?: 'v1' | 'v2';
}

const Home = ({ currentVersion = 'v1' }: HomeProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4 py-12">
      <div className="bg-white/80 rounded-xl shadow-xl p-8 max-w-xl w-full relative">
        {/* Version Badge - positioned at top-right corner of the card */}
        <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium shadow-md ${
          currentVersion === 'v2' 
            ? 'bg-purple-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {currentVersion === 'v2' ? 'Enhanced V2' : 'Stable V1'}
        </div>
        
        {/* Centered Title */}
        <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">Welcome to Outfit Guru</h2>
        
        <p className="text-slate-600 mb-4 text-center">
          Your one-stop solution for outfit inspiration!
        </p>
        <div className="text-center">
          <p className="text-sm text-slate-500">
            {currentVersion === 'v2' 
              ? '🚀 You\'re using the enhanced detection with improved color analysis' 
              : '✨ You\'re using the stable version with proven reliability'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;