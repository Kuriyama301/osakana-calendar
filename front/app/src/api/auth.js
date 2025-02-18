/**
 * 認証機能に関するAPI通信を管理
 * Api::V1::Auth名前空間のコントローラーとの通信を処理
 * ユーザー登録、ログイン/ログアウト、パスワードリセット、ソーシャル認証などの認証関連の通信を実行
 */

import client from "./client";
import { tokenManager } from "../utils/tokenManager";

/**
 * エラーレスポンスを整形
 * バックエンドからの各種エラーレスポンスを統一された形式に変換
 */
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

/**
 * JWT認証トークンの処理
 * Api::V1::Auth::SessionsControllerから受け取ったトークンを保存
 */
const handleAuthToken = (token) => {
  if (!token) {
    console.warn("No auth token received");
    throw new Error("認証トークンが見つかりません");
  }
  tokenManager.setToken(token);
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * 認証情報のクリア
 * ログアウトやエラー時にトークンと認証ヘッダーを削除
 */
const clearAuthInfo = () => {
  tokenManager.clearAll();
  delete client.defaults.headers.common["Authorization"];
};

export const authAPI = {
  /**
   * ユーザー登録
   * POST /api/v1/auth にリクエストを送信
   * Api::V1::Auth::RegistrationsController#createを呼び出し
   */
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

  /**
   * ログイン処理
   * POST /api/v1/auth/sign_in にリクエストを送信
   * Api::V1::Auth::SessionsController#createを呼び出し
   * JWTトークンを受け取り保存
   */
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

  /**
   * ログアウト処理
   * DELETE /api/v1/auth/sign_out にリクエストを送信
   * Api::V1::Auth::SessionsController#destroyを呼び出し
   * 認証情報をクリア
   */
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

  /**
   * メールアドレス確認
   * GET /api/v1/auth/confirmation にリクエストを送信
   * Api::V1::Auth::ConfirmationsController#showを呼び出し
   */
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

  /**
   * パスワードリセットリクエスト
   * POST /api/v1/auth/password にリクエストを送信
   * Api::V1::Auth::PasswordsController#createを呼び出し
   */
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

  /**
   * パスワードリセット実行
   * PUT /api/v1/auth/password にリクエストを送信
   * Api::V1::Auth::PasswordsController#updateを呼び出し
   */
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

  /**
   * Google認証
   * POST /api/v1/auth/google_oauth2/callback にリクエストを送信
   * Api::V1::Auth::OmniauthCallbacksController#google_oauth2を呼び出し
   */
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

  /**
   * LINE認証
   * LINE OAuthフローを管理し、コールバックでトークンを取得
   * Api::V1::Auth::LineControllerと連携
   */
  lineAuth: {
    getAuthUrl: () => {
      // 環境変数のチェックとフォールバック値の設定
      const channelId = import.meta.env.VITE_LINE_CHANNEL_ID || "2006841498";
      const callbackUrl =
        import.meta.env.VITE_LINE_CALLBACK_URL ||
        "https://osakana-calendar-api-7fca63533648.herokuapp.com/api/v1/auth/line/callback";

      const params = {
        response_type: "code",
        client_id: channelId,
        redirect_uri: callbackUrl,
        state: crypto.randomUUID(),
        scope: "profile openid email",
      };

      console.log("LINE認証パラメータ:", params);

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

  /**
   * アカウント削除
   * DELETE /api/v1/auth にリクエストを送信
   * Api::V1::Auth::RegistrationsController#destroyを呼び出し
   */
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
