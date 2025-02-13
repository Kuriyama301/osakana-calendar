/**
* 共通の青色ボタンコンポーネント
* ボタンのスタイル、クリック時の動作を管理
*/

import React from "react";
import PropTypes from "prop-types";

const Button = ({ type, onClick, disabled, children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: "button",
  disabled: false,
};

export default Button;
