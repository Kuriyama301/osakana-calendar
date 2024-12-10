import React from "react";
import { UserCircle } from "lucide-react";
import PropTypes from "prop-types";

const AuthNavItem = ({ onAuthClick }) => {
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
