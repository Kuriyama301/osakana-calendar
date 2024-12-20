import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// モックの状態管理用オブジェクト
const mockCookieStore = {
  cookies: new Map(),
};

// js-cookieのモック
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn((key) => mockCookieStore.cookies.get(key)),
    set: vi.fn((key, value) => mockCookieStore.cookies.set(key, value)),
    remove: vi.fn((key) => mockCookieStore.cookies.delete(key)),
  },
}));

// tokenManagerのモック
vi.mock("../utils/tokenManager", () => ({
  tokenManager: {
    getToken: vi.fn(() => "test-token"),
    getUser: vi.fn(() => ({ id: 1, email: "test@example.com" })),
    setToken: vi.fn(),
    getAuthHeader: vi.fn(() => "Bearer test-token"),
    clearAll: vi.fn(),
    removeToken: vi.fn(),
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
  // Cookieストアをリセット
  mockCookieStore.cookies.clear();
});

afterEach(() => {
  // タイマーをリセット
  vi.clearAllTimers();
});

// コンソールエラーの警告を抑制
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes("Warning: ReactDOM.render is no longer supported")) {
    return;
  }
  originalError.call(console, ...args);
};
