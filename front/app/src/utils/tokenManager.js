import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "auth_token";
const USER_COOKIE_KEY = "user_data";

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  expires: 1,
  path: "/",
};

const log = process.env.NODE_ENV === "production" ? () => {} : console.log;

export const tokenManager = {
  // トークンの保存（有効期限を設定）
  setToken(token) {
    if (token) {
      log("Setting token:", token);
      Cookies.set(TOKEN_COOKIE_KEY, token, COOKIE_OPTIONS);
      log("Token set in cookie:", Cookies.get(TOKEN_COOKIE_KEY));
    }
  },

  // ユーザー情報の保存
  setUser(user) {
    if (user) {
      log("Setting user:", user);
      Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), COOKIE_OPTIONS);
    }
  },

  // トークンの取得
  getToken() {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    log("Getting token:", token);
    return token;
  },

  // ユーザー情報の取得
  getUser() {
    const userData = Cookies.get(USER_COOKIE_KEY);
    log("Getting user data:", userData);
    return userData ? JSON.parse(userData) : null;
  },

  // 全てのデータを削除
  clearAll() {
    Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
    Cookies.remove(USER_COOKIE_KEY, { path: "/" });
    log("Cleared all cookies");
  },

  // 認証状態の確認
  isAuthenticated() {
    const hasToken = !!this.getToken();
    const hasUser = !!this.getUser();
    log("Auth check:", { hasToken, hasUser });
    return hasToken && hasUser;
  },

  // Authorization ヘッダーの形式でトークンを取得
  getAuthHeader() {
    const token = this.getToken();
    const header = token ? `Bearer ${token}` : null;
    log("Auth header:", header);
    return header;
  },
};

export default tokenManager;
