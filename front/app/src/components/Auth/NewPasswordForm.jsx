import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../Common/InputField";
import Button from "../Common/Button";
import authAPI from "../../api/auth";

const NewPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("reset_password_token");

  useEffect(() => {
    if (!resetToken) {
      setError("無効なリセットトークンです");
      setStatus("error");
    }
  }, [resetToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      await authAPI.resetPassword(
        formData.password,
        formData.passwordConfirmation,
        resetToken
      );
      setStatus("success");
      
      // 成功メッセージを表示して3秒後にログインページへ遷移
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  // トークンがない場合はエラーメッセージを表示
  if (!resetToken) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600">
          無効なリセットリンクです。パスワードリセットを再度実行してください。
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">新しいパスワードの設定</h2>

      {status === "success" ? (
        <div className="text-green-600">
          パスワードを更新しました。ログイン画面に移動します...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            type="password"
            name="password"
            label="新しいパスワード"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <InputField
            type="password"
            name="passwordConfirmation"
            label="パスワードの確認"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            required
            minLength={6}
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button 
            type="submit" 
            disabled={status === "loading"}
          >
            {status === "loading" ? "更新中..." : "パスワードを更新"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default NewPasswordForm;