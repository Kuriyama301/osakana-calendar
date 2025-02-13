/**
* エラー処理のユーティリティ関数
* APIレスポンスのエラーメッセージを整形し、
* ユーザーに分かりやすい形式に変換する
*/

export const formatError = (error) => {
  if (!error) {
    return "予期せぬエラーが発生しました";
  }

  if (error.response?.data) {
    const { data } = error.response;

    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.join(", ");
    }

    if (data.message || data.error) {
      return data.message || data.error;
    }
  }

  if (error.message === "Network Error") {
    return "サーバーに接続できません。インターネット接続を確認してください。";
  }

  return error.message || "予期せぬエラーが発生しました";
};

export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    return "メールアドレスまたはパスワードが正しくありません";
  }

  if (error.response?.status === 403) {
    return "メールアドレスの確認が必要です";
  }

  return formatError(error);
};
