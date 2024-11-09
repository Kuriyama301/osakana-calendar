import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import SeasonTerm from './SeasonTerm';

const FishDetails = ({ isOpen, onClose, fish }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setImageError(false);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleImageError = () => {
    setImageError(true);
    console.log(`Image loading failed for ${fish?.name}`);
  };

  if (!isAnimating && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
      } flex items-center justify-center z-50`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
          isAnimating && isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            {fish?.name}
          </h2>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide p-4 sm:p-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              {fish?.image_url && !imageError ? (
                <img 
                  src={fish.image_url}
                  alt={fish.name} 
                  className="w-full h-auto object-contain rounded-lg"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <span className="text-gray-600 block">{fish?.name}</span>
                    <span className="text-gray-500 text-sm block mt-2">画像を読み込めませんでした</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-2">旬の季節</h3>
              {fish?.fish_seasons && fish.fish_seasons.length > 0 ? (
                fish.fish_seasons.map((season, index) => (
                  <SeasonTerm key={index} season={season} />
                ))
              ) : (
                <p className="text-lg text-gray-700 mb-4">シーズン情報なし</p>
              )}
              
              <h3 className="text-xl font-semibold mb-2 mt-6">原産地</h3>
              <p className="text-lg text-gray-700 mb-4">{fish?.origin}</p>
              
              <h3 className="text-xl font-semibold mb-2">栄養</h3>
              <p className="text-lg text-gray-700 mb-4">{fish?.nutrition}</p>
              
              <h3 className="text-xl font-semibold mb-2">特徴</h3>
              <p className="text-lg text-gray-700">{fish?.features}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FishDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fish: PropTypes.shape({
    name: PropTypes.string,
    image_url: PropTypes.string,
    fish_seasons: PropTypes.arrayOf(PropTypes.shape({
      start_date: PropTypes.string,
      end_date: PropTypes.string
    })),
    origin: PropTypes.string,
    nutrition: PropTypes.string,
    features: PropTypes.string
  })
};

export default FishDetails;