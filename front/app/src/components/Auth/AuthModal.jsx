/**
* 認証モーダルのコンポーネント
* ログインフォームと新規登録フォームの切り替え、モーダルの表示制御を行う
*/

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import RegisterSection from "./RegisterSection";

const AuthModal = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "login" ? "register" : "login"));
  };

  const handleGoogleAuth = () => {
    console.log("Google auth clicked");
  };

  const handleLoginSuccess = () => {
    onClose();
  };

  if (!isAnimating && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-[150] transition-all duration-300 ${
        isAnimating ? "bg-opacity-50" : "bg-opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-md transform transition-all duration-300 ${
          isAnimating && isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {authMode === "login" ? (
            <>
              <LoginForm
                // onGoogleLogin={handleGoogleAuth}
                onSuccess={handleLoginSuccess}
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAuthMode();
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    はじめてご利用の方
                  </a>
                </p>
              </div>
            </>
          ) : (
            <>
              <RegisterSection onGoogleRegister={handleGoogleAuth} />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleAuthMode();
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    すでにアカウントをお持ちの方はこちら
                  </a>
                </p>
              </div>
            </>
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
