import client from "./client";
import { tokenManager } from "../utils/tokenManager";

// レスポンスエラーを整形するヘルパー関数
const formatError = (error) => {
  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(", ");
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return "エラーが発生しました。しばらく経ってからお試しください。";
};

export const authAPI = {
  // サインアップ
  signup: async (email, password, passwordConfirmation, name) => {
    try {
      // デバッグ用ログの追加
      console.log("Sending signup request with:", { email, name });

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

      const token = response.data.token;
      if (token) {
        tokenManager.setToken(token);
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No auth token received");
      }

      return {
        user: {
          data: {
            attributes: response.data.data.data.attributes,
          },
        },
        token: token,
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
      await client.delete("/api/v1/auth/sign_out");
      tokenManager.clearAll();
      delete client.defaults.headers.common["Authorization"];
    } catch (error) {
      throw formatError(error);
    }
  },

  // メール確認
  confirmEmail: async (token) => {
    try {
      const response = await client.get(`/api/v1/auth/confirmation`, {
        params: { token },
      });
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },

  // パスワードリセットメールの送信リクエスト
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

  // 新しいパスワードの設定
  resetPassword: async (password, passwordConfirmation, resetToken) => {
    try {
      const response = await client.put("/api/v1/auth/password", {
        user: {
          reset_password_token: resetToken,
          password: password,
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
      console.log("Sending Google auth request with credential:", credential);

      const response = await client.post(
        "/api/v1/auth/google_oauth2/callback",
        {
          credential: credential,
        }
      );

      console.log("Google auth response:", response.data);
      console.log("Response token:", response.data.token);

      const token = response.data.token;
      if (!token) {
        console.error("No token in response");
        throw new Error("認証トークンが見つかりません");
      }

      tokenManager.setToken(token);
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(
        "Set Authorization header:",
        client.defaults.headers.common["Authorization"]
      );

      return {
        user: response.data.data,
        token: token,
      };
    } catch (error) {
      console.error("Google auth error details:", {
        message: error.message,
        response: error.response,
        data: error.response?.data,
      });
      throw formatError(error);
    }
  },

  // アカウント削除
  deleteAccount: async () => {
    try {
      const token = tokenManager.getToken();
      console.log("Attempting to delete account with token:", token);

      if (!token) {
        throw new Error("認証情報がありません");
      }

      // 認証ヘッダーを設定
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      const response = await client.delete("/api/v1/auth", { headers });
      console.log("Delete account response:", response);

      if (response.status === 200 || response.status === 204) {
        // 成功時はトークンをクリア
        tokenManager.clearAll();
        delete client.defaults.headers.common["Authorization"];
      }

      return response.data;
    } catch (error) {
      console.error("Delete account error details:", {
        message: error.message,
        response: error.response,
        data: error.response?.data,
      });
      throw error.response?.data || error;
    }
  },
};

export default authAPI;
