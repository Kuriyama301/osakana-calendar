import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Common/Modal";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import authAPI from "../../api/auth";

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="パスワードをお忘れの方">
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
    </Modal>
  );
};

PasswordResetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PasswordResetModal;
