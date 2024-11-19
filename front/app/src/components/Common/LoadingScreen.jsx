import React from "react";
import { BeatLoader } from "react-spinners";
import PropTypes from "prop-types";

const LoadingScreen = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center space-y-6">
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
          <p className="text-gray-600">旬の魚の情報を読み込んでいます...</p>
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default LoadingScreen;
