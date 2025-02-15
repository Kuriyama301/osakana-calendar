/**
* LINE認証ボタンのコンポーネント
* LINEログイン、登録への遷移処理、ボタンの表示を行う
*/

import React from "react";
import PropTypes from "prop-types";
import { authAPI } from "../../api/auth";

const LineIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M24 10.786c0-4.556-4.558-8.268-10.161-8.268-5.602 0-10.161 3.712-10.161 8.268 0 4.087 3.627 7.512 8.529 8.163.332.072.785.22.9.505.103.26.067.666.033.927l-.146.873c-.045.26-.206 1.018.891.555s5.912-3.48 8.072-5.958c1.487-1.633 2.043-3.293 2.043-5.065zm-14.029 2.018h-2.057v-3.088c0-.116-.094-.21-.21-.21h-.675c-.115 0-.21.094-.21.21v3.973c0 .116.095.21.21.21h2.942c.116 0 .21-.094.21-.21v-.674c0-.116-.094-.21-.21-.21zm6.028 0h-2.057v-3.088c0-.116-.094-.21-.21-.21h-.675c-.116 0-.21.094-.21.21v3.973c0 .116.094.21.21.21h2.942c.116 0 .21-.094.21-.21v-.674c0-.116-.094-.21-.21-.21zm-3.013 0h-.675c-.116 0-.21.094-.21.21v.674c0 .116.094.21.21.21h.674c.116 0 .21-.094.21-.21v-.674c0-.116-.094-.21-.21-.21zm3.013-3.298h-.675c-.116 0-.21.094-.21.21v.674c0 .116.094.21.21.21h.674c.116 0 .21-.094.21-.21v-.674c0-.116-.094-.21-.21-.21z"
    />
  </svg>
);

const LineAuthButton = ({ type = "login", disabled = false }) => {
  const buttonText = type === "login" ? "LINEでログイン" : "LINEで登録";

  const handleClick = () => {
    // デバッグ用のログを追加
    console.log("LINE認証の環境変数:", {
      channelId: import.meta.env.VITE_LINE_CHANNEL_ID,
      callbackUrl: import.meta.env.VITE_LINE_CALLBACK_URL,
    });

    const lineAuthUrl = authAPI.lineAuth.getAuthUrl();
    console.log("生成されたLINE認証URL:", lineAuthUrl);

    window.location.href = lineAuthUrl;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full p-3 bg-[#06C755] text-white rounded-md 
        flex items-center justify-center gap-2
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#05B54C]"}
        transition-colors`}
    >
      <LineIcon />
      {buttonText}
    </button>
  );
};

LineAuthButton.propTypes = {
  type: PropTypes.oneOf(["login", "register"]),
  disabled: PropTypes.bool,
};

export default LineAuthButton;
