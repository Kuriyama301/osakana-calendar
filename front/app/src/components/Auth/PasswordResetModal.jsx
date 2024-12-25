import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import authAPI from "../../api/auth";

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await authAPI.requestPasswordReset(email);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  if (!isAnimating && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
        isAnimating && isOpen ? "bg-opacity-50" : "bg-opacity-0"
      } flex items-center justify-center z-50`}
      onClick={handleCloseModal}
    >
      <div
        className={`bg-white rounded-lg text-gray-800 relative w-full mx-4 sm:mx-8 md:mx-auto md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
          isAnimating && isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 pr-8 sm:pr-12">
            パスワードをお忘れの方
          </h2>
          <button
            onClick={handleCloseModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-600 bg-white hover:bg-gray-300 hover:text-gray-800 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {status === "success" ? (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              パスワードリセット用のメールを送信しました。
              パスワードの再設定を行ってください。
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label className="block text-sm mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full pl-3 pr-10 py-2 bg-white border-2 border-gray-200 rounded-lg
                    shadow-sm placeholder:text-gray-400 text-gray-900
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    transition duration-200 ease-in-out
                    disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="メールアドレスを入力してください"
                  required
                />
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
                {status === "loading" ? "送信中..." : "送信する"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

PasswordResetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PasswordResetModal;
