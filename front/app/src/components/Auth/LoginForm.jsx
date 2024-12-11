import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import SocialAuthButton from "./SocialAuthButton";

// ログインフォームコンポーネント
const LoginForm = ({ onGoogleLogin }) => {
  // フォームの入力値を管理
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 入力値の更新処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 入力値のクリア処理
  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  // フォーム送信処理
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Log in（現在開発中）</h2>
      {/* ログインフォーム */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* メールアドレス入力欄 */}
        <div className="relative">
          <label className="block text-sm mb-1">メールアドレス</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out"
              placeholder="メールアドレスを入力してください"
            />
            {/* クリアボタン */}
            {formData.email && (
              <button
                type="button"
                onClick={() => handleClear("email")}
                className="absolute right-2 top-1/2 -translate-y-1/2
                  text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 
                  rounded-full p-2 transition-colors duration-200"
                aria-label="クリア"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* パスワード入力欄 */}
        <div className="relative">
          <label className="block text-sm mb-1">パスワード</label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out"
              placeholder="パスワードを入力してください"
            />
            {/* クリアボタン */}
            {formData.password && (
              <button
                type="button"
                onClick={() => handleClear("password")}
                className="absolute right-2 top-1/2 -translate-y-1/2
                  text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 
                  rounded-full p-2 transition-colors duration-200"
                aria-label="クリア"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* ログインボタン */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          ログインする
        </button>
      </form>

      {/* パスワードリセットリンク */}
      <div className="text-center">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
          パスワードをお忘れの方はこちら
        </a>
      </div>

      {/* Googleログインボタン */}
      <SocialAuthButton onClick={onGoogleLogin} type="login" />
    </div>
  );
};

LoginForm.propTypes = {
  onGoogleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
