import React from "react";
import { X } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children }) => {
  const { isAnimating, shouldRender } = useModal(isOpen);

  Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-300 ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative transition-all duration-300 
          w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl 
          max-h-[90vh] flex flex-col overflow-hidden
          ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8 sm:pr-12">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide p-4 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
