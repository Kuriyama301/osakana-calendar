/**
* パスワード再設定フォームのコンポーネント
* 新しいパスワードの入力、確認入力、更新処理を表示する
*/

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import authAPI from "../../api/auth";

const NewPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("reset_password_token");

  useEffect(() => {
    if (!resetToken) {
      setError("無効なリセットトークンです");
      setStatus("error");
    }
  }, [resetToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleClear = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      await authAPI.resetPassword(
        formData.password,
        formData.passwordConfirmation,
        resetToken
      );
      setStatus("success");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (!resetToken) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          無効なリセットリンクです。パスワードリセットを再度実行してください。
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-xl font-semibold mb-6">新しいパスワードの設定</h2>

      {status === "success" ? (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          パスワードを更新しました。ログイン画面に移動します...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 新しいパスワード入力欄 */}
          <div className="relative">
            <label className="block text-sm mb-1">新しいパスワード</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={status === "loading"}
                className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                  shadow-sm placeholder:text-gray-400 text-gray-900
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  transition duration-200 ease-in-out
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="新しいパスワードを入力してください"
                required
                minLength={6}
              />
              {formData.password && status !== "loading" && (
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

          {/* パスワード確認入力欄 */}
          <div className="relative">
            <label className="block text-sm mb-1">パスワード（確認用）</label>
            <div className="relative">
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                disabled={status === "loading"}
                className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                  shadow-sm placeholder:text-gray-400 text-gray-900
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  transition duration-200 ease-in-out
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="パスワードを再入力してください"
                required
                minLength={6}
              />
              {formData.passwordConfirmation && status !== "loading" && (
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

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full p-3 bg-blue-500 text-white rounded-md
              hover:bg-blue-600 transition-colors
              disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "更新中..." : "パスワードを更新"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewPasswordForm;
