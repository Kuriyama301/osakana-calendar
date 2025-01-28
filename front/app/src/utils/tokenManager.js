import Cookies from "js-cookie";

// 定数定義
const TOKEN_COOKIE_KEY = "auth_token";
const USER_COOKIE_KEY = "user_data";

// Cookie設定のベース
const COOKIE_OPTIONS = {
  secure: true,
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  expires: 7,
  path: "/",
  domain:
    process.env.NODE_ENV === "production" ? "osakana-calendar.com" : undefined,
};

// デバッグログ設定
const debug = process.env.NODE_ENV !== "production";
const log = debug ? console.log : () => {};

export const tokenManager = {
  // トークンの保存
  setToken(token) {
    if (!token) return;

    try {
      log("Setting token:", token);
      if (process.env.NODE_ENV === "production") {
        Cookies.set(TOKEN_COOKIE_KEY, token, COOKIE_OPTIONS);
      } else {
        localStorage.setItem(TOKEN_COOKIE_KEY, token);
      }
      log("Token saved successfully");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  // ユーザー情報の保存
  setUser(user) {
    if (!user) return;

    try {
      log("Setting user:", user);
      if (process.env.NODE_ENV === "production") {
        Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), COOKIE_OPTIONS);
      } else {
        localStorage.setItem(USER_COOKIE_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  },

  // トークンの取得
  getToken() {
    try {
      const token =
        process.env.NODE_ENV === "production"
          ? Cookies.get(TOKEN_COOKIE_KEY)
          : localStorage.getItem(TOKEN_COOKIE_KEY);
      log("Getting token:", token);
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // ユーザー情報の取得
  getUser() {
    try {
      const userData =
        process.env.NODE_ENV === "production"
          ? Cookies.get(USER_COOKIE_KEY)
          : localStorage.getItem(USER_COOKIE_KEY);
      log("Getting user data:", userData);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // 全てのデータを削除
  clearAll() {
    try {
      if (process.env.NODE_ENV === "production") {
        Cookies.remove(TOKEN_COOKIE_KEY, { ...COOKIE_OPTIONS, path: "/" });
        Cookies.remove(USER_COOKIE_KEY, { ...COOKIE_OPTIONS, path: "/" });
      } else {
        localStorage.removeItem(TOKEN_COOKIE_KEY);
        localStorage.removeItem(USER_COOKIE_KEY);
      }
      // 進行中のリクエストをキャンセル
      if (window.activeRequests) {
        window.activeRequests.forEach((controller) => controller.abort());
        window.activeRequests = [];
      }
      log("All tokens and user data cleared");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  },

  // 認証ヘッダーの形式でトークンを取得
  getAuthHeader() {
    const token = this.getToken();
    const header = token ? `Bearer ${token}` : null;
    log("Auth header:", header);
    return header;
  },

  // 認証状態の確認
  isAuthenticated() {
    const hasToken = !!this.getToken();
    const hasUser = !!this.getUser();
    log("Auth check:", { hasToken, hasUser });
    return hasToken && hasUser;
  },
};

export default tokenManager;
