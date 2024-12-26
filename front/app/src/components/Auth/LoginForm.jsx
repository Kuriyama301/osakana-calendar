import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import SocialAuthButton from "./SocialAuthButton";
import PasswordResetModal from "./PasswordResetModal";
import { authAPI } from "../../api/auth";
import { tokenManager } from "../../utils/tokenManager";

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // 入力値の更新処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // エラーをクリア
    setError(null);
  };

  // 入力値のクリア処理
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

    try {
      await login(formData.email, formData.password);

      // フォームをリセット
      setFormData({ email: "", password: "" });

      // 成功時のコールバックを実行
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setShowResetModal(true);
  };

  // GoogleLogin
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google Login Success:", tokenResponse);
        // tokenResponseの形式を確認
        const result = await authAPI.googleAuth(tokenResponse.access_token);
        if (result.token) {
          tokenManager.setToken(result.token);
          tokenManager.setUser(result.user);
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        setError(err.message || "Google認証に失敗しました");
      }
    },
    flow: "implicit",
    scope: "email profile",
  });

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">ログイン</h2>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 text-white rounded-md
              hover:bg-blue-600 transition-colors
              disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "ログイン中..." : "ログインする"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={handleResetClick}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            パスワードをお忘れの方はこちら
          </button>
        </div>

        <SocialAuthButton
          onClick={handleGoogleLogin}
          type="login"
          disabled={loading}
        />
      </div>

      {/* モーダルをフラグメントの直下に移動 */}
      {showResetModal && (
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
        />
      )}
    </>
  );
};

LoginForm.propTypes = {
  // onGoogleLogin: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default LoginForm;
