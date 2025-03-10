import { render } from "@testing-library/react";
import { TestWrapper } from "./components/TestWrapper";

// Router付きのレンダリング用ヘルパー
export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: TestWrapper });
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
