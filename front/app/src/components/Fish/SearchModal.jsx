import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import FishDetails from "./FishDetails";
import SeasonTerm from "./SeasonTerm";

const SearchModal = ({ isOpen, onClose, searchResults }) => {
  // 状態管理
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedFish, setSelectedFish] = useState(null);
  const [isFishDetailsOpen, setIsFishDetailsOpen] = useState(false);

  // モーダルの開閉
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 画像読み込みエラー処理
  const handleImageError = (fishId, fishName) => {
    setImageErrors((prev) => ({
      ...prev,
      [fishId]: true,
    }));
    console.log(`Image loading failed for ${fishName}`);
  };

  // 魚の詳細表示
  const handleFishClick = (fish) => {
    // console.log('Fish clicked:', fish); // デバッグ用
    setSelectedFish(fish);
    setIsFishDetailsOpen(true);
  };

  const handleCloseFishDetails = () => {
    setIsFishDetailsOpen(false);
    setSelectedFish(null);
  };

  // モーダルの非表示時には何もしない
  if (!isAnimating && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={onClose}
    >
      {/* メインのモーダルコンテンツ */}
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl 
          max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out 
          ${
            isAnimating && isOpen
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー部分 */}
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8 sm:pr-12">
            検索結果
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* 検索結果の表示 */}
        <div className="flex-grow overflow-y-auto scrollbar-hide p-4 sm:p-6">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((fish) => (
                <div
                  key={fish.id}
                  className="flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-200 hover:scale-105"
                  onClick={() => handleFishClick(fish)}
                >
                  {/* 魚の画像表示 */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-2">
                    {!imageErrors[fish.id] ? (
                      <img
                        src={fish.image_url}
                        alt={fish.name}
                        className="max-w-full max-h-full object-contain rounded-lg"
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
                  {/* 魚の情報表示 */}
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    {fish.name}
                  </p>
                  {/* 旬の時期表示 */}
                  {fish.fish_seasons &&
                    fish.fish_seasons.map((season, index) => (
                      <SeasonTerm key={index} season={season} />
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">該当する魚が見つかりませんでした</p>
            </div>
          )}
        </div>
      </div>

      {/* 魚の詳細情報モーダル */}
      <FishDetails
        isOpen={isFishDetailsOpen}
        onClose={handleCloseFishDetails}
        fish={selectedFish}
      />
    </div>
  );
};

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string,
      features: PropTypes.string,
      fish_seasons: PropTypes.arrayOf(
        PropTypes.shape({
          start_month: PropTypes.number,
          start_day: PropTypes.number,
          end_month: PropTypes.number,
          end_day: PropTypes.number,
        })
      ),
    })
  ).isRequired,
};

export default SearchModal;
