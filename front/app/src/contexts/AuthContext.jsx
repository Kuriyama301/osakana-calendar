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

  // 初期化時の処理
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

  // サインアップ処理
  const signup = useCallback(
    async (email, password, passwordConfirmation, name) => {
      try {
        setError(null);
        const response = await authAPI.signup(
          email,
          password,
          passwordConfirmation,
          name
        );

        if (response.status === "success") {
          return response;
        } else {
          throw new Error(response.message || "登録に失敗しました");
        }
      } catch (err) {
        setError(formatError(err));
        throw err;
      }
    },
    []
  );

  // ログイン処理
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

  // ログアウト処理
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

  // Google認証処理を追加
  const googleAuth = useCallback(async (credential) => {
    try {
      setError(null);
      const { user, token } = await authAPI.googleAuth(credential);
      
      tokenManager.setToken(token);
      tokenManager.setUser(user);
      setUser(user);

      return user;
    } catch (err) {
      setError(formatError(err));
      throw err;
    }
  }, []);

  // 認証状態チェック
  const isAuthenticated = useCallback(() => {
    return !!user && !!tokenManager.getToken();
  }, [user]);

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    googleAuth,
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
