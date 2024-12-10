import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { authAPI } from "../api/auth";
import client from "../api/client";
import Cookies from "js-cookie";

// トークン用のCookie名を定数化（定数は別ファイルに移動することも検討可能）
const TOKEN_COOKIE_KEY = "auth_token";

// コンテキストの作成
const AuthContext = createContext(null);

// プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初期認証状態の確認
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = Cookies.get(TOKEN_COOKIE_KEY);
        if (token) {
          // TODO: トークンの有効性検証やユーザー情報の取得
          // 現時点では簡易的な実装
          client.defaults.headers.common["Authorization"] = token;
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // ログイン処理
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const { user, token } = await authAPI.login(email, password);
      setUser(user);
      Cookies.set(TOKEN_COOKIE_KEY, token, { secure: true });
      return user;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // サインアップ処理
  const signup = useCallback(async (email, password, passwordConfirmation) => {
    try {
      setError(null);
      const result = await authAPI.signup(
        email,
        password,
        passwordConfirmation
      );
      return result;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setUser(null);
      Cookies.remove(TOKEN_COOKIE_KEY);
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // 認証状態チェック
  const isAuthenticated = useCallback(() => {
    return !!user && !!Cookies.get(TOKEN_COOKIE_KEY);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PropTypesの定義
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// useAuthフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
