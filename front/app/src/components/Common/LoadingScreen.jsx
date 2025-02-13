/**
* ローディング画面のコンポーネント
* データ読み込み中のアニメーションとメッセージを表示
*/

import React, { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import PropTypes from "prop-types";

const LoadingScreen = ({ isOpen }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center z-50 
        transition-all duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`text-center space-y-6 
          transition-transform duration-300
          ${isVisible ? "scale-100" : "scale-95"}
        `}
      >
        <BeatLoader
          color="#3B82F6"
          size={20}
          margin={2}
          speedMultiplier={1}
          loading={true}
          aria-label="Loading Spinner"
        />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
          <p className="text-gray-600">旬のサカナの情報を読み込んでいます...</p>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default LoadingScreen;
