import React from "react";
import PropTypes from "prop-types";
import SocialAuthButton from "./SocialAuthButton";

// 通常の会員登録とGoogle登録オプション
const RegisterSection = ({ onGoogleRegister }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">はじめてご利用の方（現在開発中）</h2>
      <p className="text-gray-600">一部機能の利用には会員登録が必要です</p>
      <div className="space-y-4">
        {/* 通常の会員登録ボタン */}
        <button className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition-colors">
          新規会員登録
        </button>
        {/* Google登録ボタン */}
        <SocialAuthButton onClick={onGoogleRegister} type="register" />
      </div>
    </div>
  );
};

RegisterSection.propTypes = {
  onGoogleRegister: PropTypes.func.isRequired,
};

export default RegisterSection;
