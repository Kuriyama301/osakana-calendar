import React from "react";
import { UserCircle, LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";

const AuthNavItem = ({ onAuthClick }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthenticated()) {
    return (
      <li className="flex items-center gap-4">
        {/* ログイン済みの表示 */}
        <div className="flex items-center space-x-3 p-3">
          <span className="text-blue-500">
            <UserCircle size={20} />
          </span>
          <span className="font-medium text-gray-700">
            {user?.name || "ユーザー"}
          </span>
        </div>
        {/* ログアウトボタン */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm">ログアウト</span>
        </button>
      </li>
    );
  }

  // 未ログイン時の表示（既存の実装）
  return (
    <li
      className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
      onClick={onAuthClick}
    >
      <span className="text-gray-600">
        <UserCircle size={20} />
      </span>
      <span className="font-medium text-gray-700">Log in / Sign up</span>
    </li>
  );
};

AuthNavItem.propTypes = {
  onAuthClick: PropTypes.func.isRequired,
};

export default AuthNavItem;
