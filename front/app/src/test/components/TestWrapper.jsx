import PropTypes from "prop-types";
import { BrowserRouter } from "react-router-dom";

export function TestWrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
