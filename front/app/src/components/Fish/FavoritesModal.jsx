import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import SeasonTerm from "./SeasonTerm";
import FishDetails from "./FishDetails";
import { useModal } from "../../hooks/useModal";

const FavoritesModal = ({ isOpen, onClose }) => {
  const { favorites, isLoading, fetchFavorites } = useFavorites();
  const [selectedFish, setSelectedFish] = useState(null);
  const [isFishDetailsOpen, setIsFishDetailsOpen] = useState(false);
  const { isAnimating, shouldRender } = useModal(isOpen);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen, fetchFavorites]);

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
    setIsFishDetailsOpen(true);
  };

  const handleImageError = (fishId) => {
    setImageErrors((prev) => ({ ...prev, [fishId]: true }));
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8">
            お気に入りの魚
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-4">お気に入りの魚はありません</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {favorites.map((fish) => (
                <div
                  key={fish.id}
                  className="flex flex-col items-center p-2 cursor-pointer hover:bg-gray-50 rounded-lg"
                  onClick={() => handleFishClick(fish)}
                >
                  {!imageErrors[fish.id] ? (
                    <img
                      src={fish.image_url}
                      alt={fish.name}
                      className="w-32 h-32 object-contain rounded-lg"
                      onError={() => handleImageError(fish.id)}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-lg">
                      <span className="text-sm text-gray-600">{fish.name}</span>
                    </div>
                  )}
                  <p className="mt-2 text-center font-semibold">{fish.name}</p>
                  {fish.fish_seasons?.[0] && (
                    <SeasonTerm season={fish.fish_seasons[0]} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FishDetails
        isOpen={isFishDetailsOpen}
        onClose={() => setIsFishDetailsOpen(false)}
        fish={selectedFish}
      />
    </div>
  );
};

FavoritesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FavoritesModal;
