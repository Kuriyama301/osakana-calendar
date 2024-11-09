import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 必要なモックの設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// スクロール関連のモック
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();

// IntersectionObserverのモック
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // テスト間でDOM要素をクリーンアップ
  cleanup();
});

afterEach(() => {
  // タイマーをリセット
  vi.clearAllTimers();
});

// コンソールエラーの警告を抑制（必要に応じて）
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes("Warning: ReactDOM.render is no longer supported")) {
    return;
  }
  originalError.call(console, ...args);
};
