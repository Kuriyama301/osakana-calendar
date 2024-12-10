import client from "./client";

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
  // ログイン
  login: async (email, password) => {
    try {
      const response = await client.post("/api/v1/auth/sign_in", {
        user: { email, password },
      });

      // JWTトークンをレスポンスヘッダーから取得
      const authToken = response.headers["authorization"];
      if (authToken) {
        // クライアントのデフォルトヘッダーにトークンを設定
        client.defaults.headers.common["Authorization"] = authToken;
      }

      return {
        user: response.data,
        token: authToken,
      };
    } catch (error) {
      throw formatError(error);
    }
  },

  // サインアップ
  signup: async (email, password, passwordConfirmation) => {
    try {
      const response = await client.post("/api/v1/auth/sign_up", {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });

      return {
        user: response.data,
        message: "アカウントを作成しました。確認メールをご確認ください。",
      };
    } catch (error) {
      throw formatError(error);
    }
  },

  // ログアウト
  logout: async () => {
    try {
      await client.delete("/api/v1/auth/sign_out");
      // ヘッダーからトークンを削除
      delete client.defaults.headers.common["Authorization"];
    } catch (error) {
      throw formatError(error);
    }
  },
};

export default authAPI;
