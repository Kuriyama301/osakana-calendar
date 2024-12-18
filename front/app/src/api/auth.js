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
  // サインアップ
  signup: async (email, password, passwordConfirmation, name) => {
    try {
      // デバッグ用ログの追加
      console.log('Sending signup request with:', { email, name });

      const response = await client.post("/api/v1/auth", {
        user: {
          email,
          password,
          password_confirmation: passwordConfirmation,
          name
        }
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
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No auth token received");
      }

      return {
        user: response.data.data,
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
};

export default authAPI;
