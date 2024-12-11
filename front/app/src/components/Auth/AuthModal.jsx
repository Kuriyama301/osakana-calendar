import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import LoginForm from "./LoginForm";
import RegisterSection from "./RegisterSection";

// 認証モーダルのコンポーネント
const AuthModal = ({ isOpen, onClose }) => {
  // モーダルのアニメーション状態を管理
  const [isAnimating, setIsAnimating] = useState(false);

  // モーダルの開閉アニメーション
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Google認証のハンドラー 未実装
  const handleGoogleAuth = () => {
    console.log("Google auth clicked");
  };

  if (!isAnimating && !isOpen) return null;

  return (
    // モーダルのオーバーレイ
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={onClose}
    >
      {/* モーダルコンテンツ */}
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-4xl transform transition-all duration-300 ${
          isAnimating && isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* モーダルの2カラムレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <LoginForm onGoogleLogin={handleGoogleAuth} />
          <div className="md:border-l md:pl-8">
            <RegisterSection onGoogleRegister={handleGoogleAuth} />
          </div>
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
