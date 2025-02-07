import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { authAPI } from "../api/auth";
import client from "../api/client";
import { tokenManager } from "../utils/tokenManager";
import { formatError } from "../utils/errorHandler";
import { cancelAllRequests } from "../api/client";

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000; // 5分
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5分

// トークンの有効性チェック関数
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    const currentTime = Date.now();
    const isValid = currentTime < expiry - TOKEN_EXPIRY_BUFFER;

    if (process.env.NODE_ENV === "development") {
      console.log("Token validation:", {
        expiry: new Date(expiry),
        currentTime: new Date(currentTime),
        isValid,
      });
    }

    return isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 認証状態のクリア
  const clearAuthState = useCallback(async () => {
    setUser(null);
    setError(null);

    // 進行中のリクエストをキャンセル
    cancelAllRequests();

    // 認証情報をクリア
    tokenManager.clearAll();
    delete client.defaults.headers.common["Authorization"];

    return true;
  }, []);

  // トークン期限切れチェック
  const checkTokenExpiration = useCallback(() => {
    const token = tokenManager.getToken();
    if (!token) return false;

    if (!isTokenValid(token)) {
      console.log("Token expired or invalid");
      clearAuthState();
      setError("セッションの有効期限が切れました。再度ログインしてください。");
      return false;
    }
    return true;
  }, [clearAuthState]);

  // 認証状態の初期化
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = tokenManager.getToken();
      const userData = tokenManager.getUser();

      if (token && userData && isTokenValid(token)) {
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
      } else {
        await clearAuthState();
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      await clearAuthState();
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [clearAuthState]);

  useEffect(() => {
    initializeAuth();

    const tokenCheckInterval = setInterval(
      checkTokenExpiration,
      TOKEN_CHECK_INTERVAL
    );

    const handleUnauthorized = async (event) => {
      console.log("Unauthorized event detected:", event.detail);
      await clearAuthState();
      setError(
        event.detail.message ||
          "認証エラーが発生しました。再度ログインしてください。"
      );
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      clearInterval(tokenCheckInterval);
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [clearAuthState, checkTokenExpiration, initializeAuth]);

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
        }
        throw new Error(response.message || "登録に失敗しました");
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  // ログイン処理
  const login = useCallback(
    async (email, password) => {
      try {
        setError(null);
        await clearAuthState();

        const { user: userData, token } = await authAPI.login(email, password);
        if (!token || !userData?.data?.attributes) {
          throw new Error("認証情報が不正です");
        }

        const userAttributes = userData.data.attributes;
        tokenManager.setToken(token);
        tokenManager.setUser(userAttributes);
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userAttributes);

        return userAttributes;
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [clearAuthState]
  );

  // ログアウト処理
  const logout = useCallback(async () => {
    try {
      if (checkTokenExpiration()) {
        await authAPI.logout();
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      await clearAuthState();
    }
  }, [clearAuthState, checkTokenExpiration]);

  // OAuth認証の共通処理
  const handleOAuthAuthentication = useCallback(
    async (authResponse) => {
      if (!authResponse?.token || !authResponse?.user?.data?.attributes) {
        throw new Error("認証情報が不正です");
      }

      const { token, user: userData } = authResponse;
      const userAttributes = userData.data.attributes;

      await clearAuthState();
      tokenManager.setToken(token);
      tokenManager.setUser(userAttributes);
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userAttributes);

      return userData;
    },
    [clearAuthState]
  );

  // Google認証処理
  const googleAuth = useCallback(
    async (credential) => {
      try {
        setError(null);
        const result = await authAPI.googleAuth(credential);
        return await handleOAuthAuthentication(result);
      } catch (err) {
        const errorMessage = formatError(err);
        console.error("Google auth error:", err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [handleOAuthAuthentication]
  );

  // LINE認証処理
  const lineAuth = useCallback(
    async (code) => {
      try {
        setError(null);
        const result = await authAPI.lineAuth.handleCallback(code);
        return await handleOAuthAuthentication(result);
      } catch (err) {
        const errorMessage = formatError(err);
        console.error("LINE auth error:", err);
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [handleOAuthAuthentication]
  );

  // 認証状態チェック
  const isAuthenticated = useCallback(() => {
    const token = tokenManager.getToken();
    return !!user && !!token && isTokenValid(token);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isInitialized,
    signup,
    login,
    logout,
    isAuthenticated,
    googleAuth,
    lineAuth,
    clearAuthState,
  };

  if (!isInitialized) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
