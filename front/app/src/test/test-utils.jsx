import PropTypes from "prop-types";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

function Wrapper({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

// Router付きのレンダリング用ヘルパー
export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: Wrapper });
}

// テスト用のモックデータ生成
export const createMockFish = (overrides = {}) => ({
  id: 1,
  name: "サンマ",
  features: "秋の味覚",
  nutrition: "DHA豊富",
  fish_seasons: [
    {
      start_month: 9,
      start_day: 1,
      end_month: 11,
      end_day: 30,
    },
  ],
  ...overrides,
});
