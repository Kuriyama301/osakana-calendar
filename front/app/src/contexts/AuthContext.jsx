import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { authAPI } from "../api/auth";
import client from "../api/client";
import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";

// コンテキストの作成とエクスポート
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
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

      const userData = user.data.attributes;

      tokenManager.setToken(token);
      tokenManager.setUser(userData);
      setUser(userData);

      // Authorization ヘッダーを設定
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("Auth state updated:", {
        userData,
        hasToken: !!token,
        isAuthenticated: !!userData && !!token,
      });

      return userData;
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

  // Google認証処理
  const googleAuth = useCallback(async (credential) => {
    try {
      setError(null);
      const result = await authAPI.googleAuth(credential);

      if (result.token) {
        // userData をレスポンス構造に合わせて抽出
        const userData = result.user.data.attributes;

        tokenManager.setToken(result.token);
        tokenManager.setUser(userData);
        setUser(userData);

        // Authorization ヘッダーを設定
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.token}`;

        console.log("Auth state updated:", {
          userData,
          hasToken: !!result.token,
          isAuthenticated: !!userData && !!result.token,
        });
      }

      return result.user;
    } catch (err) {
      console.error("Google auth error:", err);
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
