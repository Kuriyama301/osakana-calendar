import React, { useState, useEffect, useRef, useCallback } from "react";
import { MainCalendar, SubCalendar } from "../components";
import SeasonalFishModal from "../components/Fish/SeasonalFishModal";
import { useDailyFishModal } from "../hooks/useDailyFishModal";
import LoadingScreen from "../components/Common/LoadingScreen";

const HomePage = () => {
  const [showSubCalendar, setShowSubCalendar] = useState(true);
  const containerRef = useRef(null);
  const {
    isModalOpen,
    selectedModalDate,
    isLoading,
    seasonalFish,
    error,
    closeModal,
  } = useDailyFishModal();

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
      <LoadingScreen isOpen={isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-center items-start h-full">
          {/* サブカレンダー */}
          <div
            className={`sub-calendar-container ${
              showSubCalendar ? "block" : "hidden"
            } lg:block lg:w-80 fixed left-4 top-20 lg:sticky lg:top-20 lg:left-auto`}
          >
            <SubCalendar />
          </div>

          {/* 縦線 */}
          <div className="hidden lg:block w-px bg-gray-300/30 mx-8 h-screen sticky top-0" />

          {/* メインカレンダー */}
          <div className="main-calendar-container w-full max-w-3xl relative">
            <MainCalendar />
            {/* 縦線 */}
            <div className="hidden lg:block w-px bg-gray-300/30 absolute right-[-2rem] top-0 h-screen" />
          </div>
        </div>
      </div>

      <SeasonalFishModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentDate={selectedModalDate}
        seasonalFish={seasonalFish}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default HomePage;