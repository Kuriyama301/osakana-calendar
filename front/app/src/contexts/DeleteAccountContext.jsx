import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../api/auth";
import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";

const DeleteAccountContext = createContext(null);

export const DeleteAccountProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // アカウント削除処理
  const deleteAccount = useCallback(async () => {
    if (!isAuthenticated()) {
      setError("ログインが必要です");
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      // トークンの存在確認
      const token = tokenManager.getToken();
      console.log("Attempting to delete account with token:", token);

      if (!token) {
        throw new Error("認証情報が見つかりません");
      }

      // アカウント削除APIを呼び出し
      const response = await authAPI.deleteAccount();

      if (
        response.status === "success" ||
        response.status === 200 ||
        response.status === 204
      ) {
        // 認証情報をクリア
        await logout(); // AuthContextのlogout関数を使用

        // モーダルを閉じてホームページにリダイレクト
        closeModal();
        navigate("/", {
          replace: true,
          state: { message: "アカウントが正常に削除されました" },
        });
      } else {
        throw new Error(response.message || "アカウントの削除に失敗しました");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setError(formatError(err));
    } finally {
      setIsDeleting(false);
    }
  }, [isAuthenticated, navigate, logout]);

  // モーダルを開く
  const openModal = useCallback(() => {
    if (!isAuthenticated()) {
      setError("ログインが必要です");
      return;
    }
    setIsModalOpen(true);
    setError("");
  }, [isAuthenticated]);

  // モーダルを閉じる
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError("");
  }, []);

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
