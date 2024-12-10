import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isAnimating && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-md transform transition-all duration-300 ease-in-out ${
          isAnimating && isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`pb-2 px-2 font-medium ${
                  activeTab === "login"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ログイン
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`pb-2 px-2 font-medium ${
                  activeTab === "signup"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                新規登録
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 rounded-full p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "login" ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <SignupForm onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
