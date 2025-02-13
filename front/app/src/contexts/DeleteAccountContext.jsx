/**
* アカウント削除機能のコンテキストコンポーネント
* アカウント削除処理の実行とモーダル表示を制御する
*/

import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../api/auth";
// import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";

const DeleteAccountContext = createContext(null);

export const DeleteAccountProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const deleteAccount = useCallback(async () => {
    if (!isAuthenticated()) {
      setError("ログインが必要です");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await authAPI.deleteAccount();

      if (response.status === "success") {
        try {
          await logout();
          closeModal();
          navigate("/", {
            replace: true,
            state: {
              type: "success",
              message: response.message || "アカウントが削除されました",
            },
          });
        } catch (cleanupError) {
          console.error("Cleanup after deletion failed:", cleanupError);
          navigate("/", {
            replace: true,
            state: {
              type: "success",
              message: "アカウントは削除されましたが、一部の処理に失敗しました",
            },
          });
        }
      } else {
        throw new Error(response.message || "アカウントの削除に失敗しました");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setError(formatError(err));
      setIsDeleting(false);
    }
  }, [isAuthenticated, navigate, logout]);

  const openModal = useCallback(() => {
    if (!isAuthenticated()) {
      setError("ログインが必要です");
      return;
    }
    setIsModalOpen(true);
    setError("");
  }, [isAuthenticated]);

  const closeModal = useCallback(() => {
    if (!isDeleting) {
      setIsModalOpen(false);
      setError("");
    }
  }, [isDeleting]);

  const value = {
    isModalOpen,
    isDeleting,
    error,
    openModal,
    closeModal,
    deleteAccount,
    user,
  };

  return (
    <DeleteAccountContext.Provider value={value}>
      {children}
    </DeleteAccountContext.Provider>
  );
};

DeleteAccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDeleteAccount = () => {
  const context = useContext(DeleteAccountContext);
  if (!context) {
    throw new Error(
      "useDeleteAccount must be used within a DeleteAccountProvider"
    );
  }
  return context;
};

export default DeleteAccountContext;
