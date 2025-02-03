import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { authAPI } from "../api/auth";
import client from "../api/client";
import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";

// トークンの有効性チェック関数
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    const currentTime = Date.now();
    const isValid = currentTime < expiry - 5 * 60 * 1000;
    console.log("Token validation:", {
      expiry: new Date(expiry),
      currentTime: new Date(currentTime),
      isValid,
    });
    return isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

// コンテキストの作成とエクスポート
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 認証状態のクリア
  const clearAuthState = useCallback(() => {
    setUser(null);
    tokenManager.clearAll();
    delete client.defaults.headers.common["Authorization"];
  }, []);

  // トークン期限切れチェックとログアウト処理
  const checkTokenExpiration = useCallback(() => {
    const token = tokenManager.getToken();
    if (token && !isTokenValid(token)) {
      console.log("Token expired, logging out...");
      clearAuthState();
      setError("セッションの有効期限が切れました。再度ログインしてください。");
      return false;
    }
    return true;
  }, [clearAuthState]);

  // 初期化時の処理とイベントリスナー追加
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const token = tokenManager.getToken();
        const userData = tokenManager.getUser();

        if (token && userData && isTokenValid(token)) {
          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(userData);
        } else {
          clearAuthState();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // トークンチェックの間隔を5分に変更
    const tokenCheckInterval = setInterval(() => {
      const token = tokenManager.getToken();
      if (token && !isTokenValid(token)) {
        clearAuthState();
        setError(
          "セッションの有効期限が切れました。再度ログインしてください。"
        );
      }
    }, 300000);

    // auth:unauthorized イベントリスナーの設定
    const handleUnauthorized = () => {
      console.log("Unauthorized event detected, clearing auth state.");
      clearAuthState();
      setError("認証エラーが発生しました。再度ログインしてください。");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [clearAuthState]);

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
        const errorMessage = formatError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // ログイン処理
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const { user, token } = await authAPI.login(email, password);

      if (!token) {
        throw new Error("認証トークンが取得できませんでした");
      }

      const userData = user.data.attributes;

      tokenManager.setToken(token);
      tokenManager.setUser(userData);
      setUser(userData);

      // Authorization ヘッダーを設定
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("Auth state updated:", {
        userData,
        hasToken: !!token,
        isAuthenticated: !!userData && !!token && isTokenValid(token),
      });

      return userData;
    } catch (err) {
      const errorMessage = formatError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // ログアウト処理
  const logout = useCallback(async () => {
    try {
      if (checkTokenExpiration()) {
        await authAPI.logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAuthState();
    }
  }, [clearAuthState, checkTokenExpiration]);

  // Google認証処理
  const googleAuth = useCallback(async (credential) => {
    try {
      setError(null);
      const result = await authAPI.googleAuth(credential);

      if (!result.token) {
        throw new Error("認証トークンが取得できませんでした");
      }

      const userData = result.user.data.attributes;

      tokenManager.setToken(result.token);
      tokenManager.setUser(userData);
      setUser(userData);

      client.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.token}`;

      console.log("Auth state updated:", {
        userData,
        hasToken: !!result.token,
        isAuthenticated:
          !!userData && !!result.token && isTokenValid(result.token),
      });

      return result.user;
    } catch (err) {
      const errorMessage = formatError(err);
      console.error("Google auth error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // LINE認証処理
  const lineAuth = useCallback(async (code) => {
    try {
      setError(null);
      const result = await authAPI.lineAuth.handleCallback(code);

      if (!result.token) {
        throw new Error("認証トークンが取得できませんでした");
      }

      const userData = result.user.data.attributes;

      tokenManager.setToken(result.token);
      tokenManager.setUser(userData);
      setUser(userData);

      client.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;

      console.log("Auth state updated:", {
        userData,
        hasToken: !!result.token,
        isAuthenticated: !!userData && !!result.token && isTokenValid(result.token),
      });

      return result.user;
    } catch (err) {
      const errorMessage = formatError(err);
      console.error("LINE auth error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // 認証状態チェック
  const isAuthenticated = useCallback(() => {
    const token = tokenManager.getToken();
    const isValid = token ? isTokenValid(token) : false;
    return !!user && isValid;
  }, [user]);

  const value = {
    user,
    setUser,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated,
    googleAuth,
    lineAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
