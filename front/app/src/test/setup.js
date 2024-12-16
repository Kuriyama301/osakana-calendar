import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 基本的なjs-cookieモック
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// 既存のモック設定
global.ResizeObserver = vi.fn().mockImplementation(() => ({
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
