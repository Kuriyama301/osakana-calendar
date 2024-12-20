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
import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";

// トークン用のCookie名を定数化
// const TOKEN_COOKIE_KEY = "auth_token";

// コンテキストの作成
const AuthContext = createContext(null);

// プロバイダーコンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 初期化時の処理を改善
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = tokenManager.getToken();
        const userData = tokenManager.getUser();

        if (token && userData) {
          // トークンの検証
          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(userData);
        } else {
          tokenManager.clearAll();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        tokenManager.clearAll();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ログイン処理の改善
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const { user, token } = await authAPI.login(email, password);

      tokenManager.setToken(token);
      tokenManager.setUser(user);
      setUser(user);

      return user;
    } catch (err) {
      setError(formatError(err));
      throw err;
    }
  }, []);

  // ログアウト処理の改善
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      tokenManager.clearAll();
      delete client.defaults.headers.common["Authorization"];
    }
  }, []);

  // 認証状態チェック
  const isAuthenticated = useCallback(() => {
    return !!user && !!tokenManager.getToken(); // tokenManager でトークン存在確認
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
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
