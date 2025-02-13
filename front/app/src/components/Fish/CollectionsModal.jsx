/**
* 食べた魚一覧のモーダルコンポーネント
* コレクションに登録した魚の一覧表示、詳細表示を行う
*/

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useCollections } from "../../hooks/useCollections";
import SeasonTerm from "./SeasonTerm";
import FishDetails from "./FishDetails";
import { useModal } from "../../hooks/useModal";
import client from "../../api/client";

const CollectionsModal = ({ isOpen, onClose }) => {
  const { collections } = useCollections();
  const [allFish, setAllFish] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isFishDetailsOpen, setIsFishDetailsOpen] = useState(false);
  const { isAnimating, shouldRender } = useModal(isOpen);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchAllFish = async () => {
      if (isOpen) {
        setIsLoading(true);
        try {
          const response = await client.get("/api/v1/fish/search");
          setAllFish(response.data);
        } catch (error) {
          console.error("Failed to fetch fish data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllFish();
  }, [isOpen]);

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
    setIsFishDetailsOpen(true);
  };

  const handleImageError = (fishId, fishName) => {
    setImageErrors((prev) => ({ ...prev, [fishId]: true }));
    console.log(`Image loading failed for ${fishName}`);
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8">
              食べたオサカナ一覧
            </h2>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide p-4 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isLoading ? (
            <div className="text-center py-4">読み込み中...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {allFish.map((fish) => {
                const isCollected = collections.some(
                  (collected) => collected.id === fish.id
                );
                return (
                  <div
                    key={fish.id}
                    className="flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-200 relative"
                    onClick={() => handleFishClick(fish)}
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-2">
                      {!imageErrors[fish.id] ? (
                        <img
                          src={fish.image_url}
                          alt={fish.name}
                          className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-200 ${
                            !isCollected ? "grayscale opacity-50" : ""
                          }`}
                          onError={() => handleImageError(fish.id, fish.name)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                          <span className="text-sm text-gray-600">
                            {fish.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                      {fish.name}
                    </p>
                    {fish.fish_seasons && fish.fish_seasons.length > 0 ? (
                      fish.fish_seasons.map((season, index) => (
                        <SeasonTerm key={index} season={season} />
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">シーズン情報なし</p>
                    )}
                  </div>
                );
              })}
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

CollectionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CollectionsModal;
