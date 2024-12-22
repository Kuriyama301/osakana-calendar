import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/AuthContext";

const AuthNavItem = ({ onAuthClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const commonStyles =
    "flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors";

  if (isAuthenticated()) {
    return (
      <li className="relative -mt-6" ref={menuRef}>
        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={commonStyles}
        >
          <span className="text-gray-600">
            <UserCircle size={20} />
          </span>
          <span className="font-medium text-gray-700">
            {user?.name || "ユーザー"}
          </span>
        </div>

        {isMenuOpen && (
          <div className="absolute left-full top-0 ml-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50">
            <div onClick={handleLogout} className={commonStyles}>
              <span className="text-gray-600">
                <LogOut size={20} />
              </span>
              <span className="font-medium text-gray-700">ログアウト</span>
            </div>
          </div>
        )}
      </li>
    );
  }

  return (
    <li className={`${commonStyles} relative`} onClick={onAuthClick}>
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
