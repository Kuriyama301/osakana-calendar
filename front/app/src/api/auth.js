/**
 * 認証機能に関するAPI通信を管理
 * ユーザー登録、ログイン/ログアウト、パスワードリセット、ソーシャル認証（Google、LINE）などの
 * 認証関連の通信処理を実行
 */

import client from "./client";
import { tokenManager } from "../utils/tokenManager";

const formatError = (error) => {
  if (error.response?.data?.status === "error") {
    return error.response.data.message;
  }

  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors)
      .flat()
      .map((err) => err.detail || err)
      .join(", ");
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message === "Network Error") {
    return "サーバーに接続できません。インターネット接続を確認してください。";
  }

  return "エラーが発生しました。しばらく経ってからお試しください。";
};

const handleAuthToken = (token) => {
  if (!token) {
    console.warn("No auth token received");
    throw new Error("認証トークンが見つかりません");
  }
  tokenManager.setToken(token);
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const clearAuthInfo = () => {
  tokenManager.clearAll();
  delete client.defaults.headers.common["Authorization"];
};

export const authAPI = {
  signup: async (email, password, passwordConfirmation, name) => {
    try {
      console.log("Signup attempt for:", email);
      const response = await client.post("/api/v1/auth", {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
          name,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Signup error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw formatError(error);
    }
  },

  // ログイン
  login: async (email, password) => {
    try {
      const response = await client.post("/api/v1/auth/sign_in", {
        user: { email, password },
      });

      handleAuthToken(response.data.token);

      return {
        user: {
          data: {
            attributes: response.data.data.data.attributes,
          },
        },
        token: response.data.token,
      };
    } catch (error) {
      console.error("Login error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw formatError(error);
    }
  },

  // ログアウト
  logout: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        console.warn("No token found during logout");
        clearAuthInfo();
        return;
      }

      const response = await client.delete("/api/v1/auth/sign_out", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        clearAuthInfo();
      }
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthInfo();
      throw error;
    }
  },

  confirmEmail: async (token) => {
    try {
      const response = await client.get("/api/v1/auth/confirmation", {
        params: { token },
      });
      return response.data;
    } catch (error) {
      console.error("Email confirmation error:", error);
      throw formatError(error);
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await client.post("/api/v1/auth/password", {
        user: { email },
      });
      return response.data;
    } catch (error) {
      console.error("Password reset request error:", error);
      throw formatError(error);
    }
  },

  resetPassword: async (password, passwordConfirmation, resetToken) => {
    try {
      const response = await client.put("/api/v1/auth/password", {
        user: {
          reset_password_token: resetToken,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Password reset error:", error);
      throw formatError(error);
    }
  },

  // Google認証
  googleAuth: async (credential) => {
    try {
      console.log("Starting Google authentication");
      const response = await client.post(
        "/api/v1/auth/google_oauth2/callback",
        {
          credential,
        }
      );

      handleAuthToken(response.data.token);

      return {
        user: response.data.data,
        token: response.data.token,
      };
    } catch (error) {
      console.error("Google auth error:", error);
      throw formatError(error);
    }
  },

  // LINE認証
  lineAuth: {
    getAuthUrl: () => {
      const params = {
        response_type: "code",
        client_id: import.meta.env.VITE_LINE_CHANNEL_ID,
        redirect_uri: import.meta.env.VITE_LINE_CALLBACK_URL,
        state: crypto.randomUUID(),
        scope: "profile openid email",
      };

      const queryString = new URLSearchParams(params).toString();
      return `https://access.line.me/oauth2/v2.1/authorize?${queryString}`;
    },

    handleCallback: async (code) => {
      try {
        console.log("Processing LINE authentication callback");
        const response = await client.post("/api/v1/auth/line/callback", {
          code,
        });

        handleAuthToken(response.data.token);

        return {
          user: response.data.data,
          token: response.data.token,
        };
      } catch (error) {
        console.error("LINE auth error:", error);
        throw formatError(error);
      }
    },
  },

  // アカウント削除
  deleteAccount: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        throw new Error("認証情報がありません");
      }

      const response = await client.delete("/api/v1/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        clearAuthInfo();
      }

      return response.data;
    } catch (error) {
      console.error("Delete account error:", error);
      throw formatError(error);
    }
  },
};

export default authAPI;
