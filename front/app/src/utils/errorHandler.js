export const formatError = (error) => {
  if (!error) {
    return "予期せぬエラーが発生しました";
  }

  // APIエラーの場合
  if (error.response?.data) {
    const { data } = error.response;

    // 構造化されたエラーメッセージ
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(", ");
    }

    // 単一のエラーメッセージ
    if (data.message || data.error) {
      return data.message || data.error;
    }
  }

  // ネットワークエラー
  if (error.message === "Network Error") {
    return "サーバーに接続できません。インターネット接続を確認してください。";
  }

  // その他のエラー
  return error.message || "予期せぬエラーが発生しました";
};

export const handleAuthError = (error) => {
  // 認証エラー
  if (error.response?.status === 401) {
    return "メールアドレスまたはパスワードが正しくありません";
  }

  // アカウント未確認
  if (error.response?.status === 403) {
    return "メールアドレスの確認が必要です";
  }

  return formatError(error);
};
