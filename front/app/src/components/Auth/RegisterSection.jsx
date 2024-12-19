import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import SocialAuthButton from "./SocialAuthButton";

// 通常の会員登録とGoogle登録オプション
const RegisterSection = ({ onGoogleRegister }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.passwordConfirmation,
        formData.name
      );
      setSuccessMessage(
        "登録確認メールを送信しました。メールをご確認ください。"
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      });
    } catch (err) {
      setError(err.message || "登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">はじめてご利用の方</h2>
      <p className="text-gray-600">一部機能の利用には会員登録が必要です</p>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 名前入力欄 */}
        <div className="relative">
          <label className="block text-sm mb-1">お名前</label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out
                disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="お名前を入力してください"
              required
            />
            {formData.name && !loading && (
              <button
                type="button"
                onClick={() => handleClear("name")}
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

        {/* メールアドレス入力欄 */}
        <div className="relative">
          <label className="block text-sm mb-1">メールアドレス</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out
                disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="メールアドレスを入力してください"
              required
            />
            {formData.email && !loading && (
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
              disabled={loading}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out
                disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="パスワードを入力してください"
              required
            />
            {formData.password && !loading && (
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

        {/* パスワード（確認用）入力欄 */}
        <div className="relative">
          <label className="block text-sm mb-1">パスワード（確認用）</label>
          <div className="relative">
            <input
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                shadow-sm placeholder:text-gray-400 text-gray-900
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                transition duration-200 ease-in-out
                disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="パスワードを再入力してください"
              required
            />
            {formData.passwordConfirmation && !loading && (
              <button
                type="button"
                onClick={() => handleClear("passwordConfirmation")}
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

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-md
            hover:bg-blue-600 transition-colors
            disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? "登録中..." : "新規会員登録"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">または</span>
        </div>
      </div>

      <SocialAuthButton
        onClick={onGoogleRegister}
        type="register"
        disabled={loading}
      />
    </div>
  );
};

RegisterSection.propTypes = {
  onGoogleRegister: PropTypes.func.isRequired,
};

export default RegisterSection;
