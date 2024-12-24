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
          <div className="text-green-600 mb-4">
            パスワードリセット用のメールを送信しました。
            パスワードの再設定を行ってください。
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="email"
              name="email"
              label="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "送信中..." : "送信する"}
            </Button>
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
