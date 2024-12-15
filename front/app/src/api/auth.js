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
      console.log("Login attempt with:", { email });

      const response = await client.post("/api/v1/auth/sign_in", {
        user: { email, password },
      });

      console.log("Login response:", {
        status: response.status,
        headers: response.headers,
        data: response.data,
      });

      const token = response.data.token;
      console.log("Extracted token:", token);

      if (token) {
        // Bearer スキーマを追加
        const bearerToken = `Bearer ${token}`;
        // ローカルストレージにトークンを保存
        localStorage.setItem("jwt_token", token);
        // Axiosのデフォルトヘッダーに設定
        client.defaults.headers.common["Authorization"] = bearerToken;
        console.log("Token set in headers:", bearerToken);
      } else {
        console.warn("No auth token received");
      }

      return {
        user: response.data.data,
        token: token,
      };
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw formatError(error);
    }
  },

  // ログアウト
  logout: async () => {
    try {
      await client.delete("/api/v1/auth/sign_out");
      // トークンをローカルストレージから削除
      localStorage.removeItem("jwt_token");
      // ヘッダーからトークンを削除
      delete client.defaults.headers.common["Authorization"];
    } catch (error) {
      throw formatError(error);
    }
  },

  // トークンの復元処理を追加
  restoreToken: () => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  },
};

export default authAPI;
