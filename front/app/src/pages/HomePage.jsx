import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { MainCalendar, SubCalendar } from "../components";
import { Home, Utensils, Heart, HelpCircle } from "lucide-react";
import SeasonalFishModal from "../components/Fish/SeasonalFishModal";
import SearchForm from "../components/Fish/SearchForm";
import SearchModal from "../components/Fish/SearchModal";
import { searchFish } from "../api/fish";
import { useDailyFishModal } from "../hooks/useDailyFishModal";
import LoadingScreen from "../components/Common/LoadingScreen";
import AuthNavItem from "../components/Common/AuthNavItem";
import AuthModal from "../components/Auth/AuthModal";

const NavItem = ({ icon, label }) => (
  <li className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
    <span className="text-gray-600">{icon}</span>
    <span className="font-medium text-gray-700">{label}</span>
  </li>
);

// PropTypes
NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

const HomePage = () => {
  const [showSubCalendar, setShowSubCalendar] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const containerRef = useRef(null);
  const {
    isModalOpen: isFishModalOpen,
    selectedModalDate,
    isLoading: isFishLoading,
    seasonalFish,
    error,
    closeModal: closeFishModal,
  } = useDailyFishModal();

  // 検索関連の状態
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSearch = async (searchTerm) => {
    setIsSearchLoading(true);
    try {
      const results = await searchFish(searchTerm);
      setSearchResults(results);
      setIsSearchModalOpen(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const checkSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const breakpoint = 1024;
      setShowSubCalendar(containerWidth >= breakpoint);
    }
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkSize, 150);
    };

    window.addEventListener("resize", handleResize);
    checkSize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkSize]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
      }}
    >
      <LoadingScreen isOpen={isFishLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-start h-full">
          {/* サブカレンダー、ロゴ、ナビゲーション */}
          <div
            className={`${
              showSubCalendar ? "block" : "hidden"
            } lg:block lg:w-80 fixed left-4 top-6 lg:sticky lg:top-6 lg:left-auto space-y-4 z-[100]`}
          >
            {/* ロゴ */}
            <div className="mb-4">
              <img
                src="/titlelogo.png"
                alt="Osakana Calendar"
                className="w-48 mx-auto"
              />
            </div>

            {/* サブカレンダー */}
            <div className="mb-4">
              <SubCalendar />
            </div>

            {/* ナビゲーション */}
            <nav className="bg-white p-6 rounded-lg shadow w-full">
              <ul className="space-y-2">
                <NavItem icon={<Home size={20} />} label="HOME" />
                <NavItem icon={<Utensils size={20} />} label="COLLECTION" />
                <NavItem icon={<Heart size={20} />} label="FAVORITE" />
                <NavItem icon={<HelpCircle size={20} />} label="HELP" />
              </ul>
            </nav>

            <div className="bg-white p-6 rounded-lg shadow w-full relative">
              <AuthNavItem onAuthClick={() => setIsAuthModalOpen(true)} />
            </div>
          </div>

          {/* 中央の縦線 */}
          <div className="hidden lg:block w-px bg-gray-300/30 mx-8 h-screen sticky top-0" />

          {/* メインカレンダー エリア全体 */}
          <div className="w-full max-w-3xl relative flex">
            {/* メインコンテンツエリア */}
            <div className="flex-1">
              {/* 検索フォームヘッダー */}
              <div className="sticky top-0 z-10 bg-white border-b mb-4">
                <div className="flex justify-end p-4 -mx-8 border-t border-b border-gray-300/30">
                  <SearchForm
                    onSearch={handleSearch}
                    isLoading={isSearchLoading}
                    className="w-full max-w-md"
                  />
                </div>
              </div>

              {/* カレンダー本体 */}
              <MainCalendar />
            </div>

            {/* 右側の縦線 */}
            <div className="hidden lg:block w-px bg-gray-300/30 ml-8 h-screen sticky top-0" />
          </div>
        </div>
      </div>

      {/* モーダル */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchResults={searchResults}
      />

      <SeasonalFishModal
        isOpen={isFishModalOpen}
        onClose={closeFishModal}
        currentDate={selectedModalDate}
        seasonalFish={seasonalFish}
        isLoading={isFishLoading}
        error={error}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
