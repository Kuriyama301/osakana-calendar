import Cookies from "js-cookie";

const TOKEN_COOKIE_KEY = "auth_token";
const USER_COOKIE_KEY = "user_data";

export const tokenManager = {
  // トークンの保存（有効期限を設定）
  setToken(token) {
    if (token) {
      // セキュアなCookie設定
      Cookies.set(TOKEN_COOKIE_KEY, token, {
        secure: true,
        sameSite: "Strict",
        expires: 1, // 1日
        path: "/",
      });
    }
  },

  // ユーザー情報の保存
  setUser(user) {
    if (user) {
      Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), {
        secure: true,
        sameSite: "Strict",
        expires: 1,
        path: "/",
      });
    }
  },

  // トークンの取得
  getToken() {
    return Cookies.get(TOKEN_COOKIE_KEY);
  },

  // ユーザー情報の取得
  getUser() {
    const userData = Cookies.get(USER_COOKIE_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // 全てのデータを削除
  clearAll() {
    Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
    Cookies.remove(USER_COOKIE_KEY, { path: "/" });
  },

  // 認証状態の確認
  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  // Authorization ヘッダーの形式でトークンを取得
  getAuthHeader() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
};

export default tokenManager;
