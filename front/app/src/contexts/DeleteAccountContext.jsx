import { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authAPI } from "../api/auth";
import { tokenManager } from "../utils/tokenManager";

const DeleteAccountContext = createContext(null);

export const DeleteAccountProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setError("");
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError("");
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!isAuthenticated()) {
      setError("ログインしてください。");
      setIsDeleting(false);
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      console.log("Current auth state:", isAuthenticated()); // 追加
      const response = await authAPI.deleteAccount();
      console.log("Delete account response:", response);

      if (response.status === "success") {
        tokenManager.clearAll();
        navigate("/", { replace: true });
        closeModal();
      } else {
        throw new Error(response.message || "アカウントの削除に失敗しました");
      }
    } catch (err) {
      console.error("Delete account error full details:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "アカウントの削除に失敗しました"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [navigate, isAuthenticated, closeModal]);

  const value = {
    isModalOpen,
    isDeleting,
    error,
    openModal,
    closeModal,
    deleteAccount,
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
