import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "auth_token";
const USER_COOKIE_KEY = "user_data";

const COOKIE_OPTIONS = {
  secure: false,
  sameSite: "Lax",
  expires: 1,
  path: "/",
};

export const tokenManager = {
  // トークンの保存（有効期限を設定）
  setToken(token) {
    if (token) {
      console.log("Setting token:", token);
      Cookies.set(TOKEN_COOKIE_KEY, token, COOKIE_OPTIONS);
      console.log("Token set in cookie:", Cookies.get(TOKEN_COOKIE_KEY));
    }
  },

  // ユーザー情報の保存
  setUser(user) {
    if (user) {
      console.log("Setting user:", user);
      Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), COOKIE_OPTIONS);
    }
  },

  // トークンの取得
  getToken() {
    const token = Cookies.get(TOKEN_COOKIE_KEY);
    console.log("Getting token:", token);
    return token;
  },

  // ユーザー情報の取得
  getUser() {
    const userData = Cookies.get(USER_COOKIE_KEY);
    console.log("Getting user data:", userData);
    return userData ? JSON.parse(userData) : null;
  },

  // 全てのデータを削除
  clearAll() {
    Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
    Cookies.remove(USER_COOKIE_KEY, { path: "/" });
    console.log("Cleared all cookies");
  },

  // 認証状態の確認
  isAuthenticated() {
    const hasToken = !!this.getToken();
    const hasUser = !!this.getUser();
    console.log("Auth check:", { hasToken, hasUser });
    return hasToken && hasUser;
  },

  // Authorization ヘッダーの形式でトークンを取得
  getAuthHeader() {
    const token = this.getToken();
    const header = token ? `Bearer ${token}` : null;
    console.log("Auth header:", header);
    return header;
  },
};

export default tokenManager;
