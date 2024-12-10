import React from "react";
import PropTypes from "prop-types";

const TabButton = ({ isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
};

TabButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default TabButton;
