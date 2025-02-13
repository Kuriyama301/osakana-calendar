/**
* メールアドレス確認画面のコンポーネント
* メール認証の確認処理、認証状態の表示、画面遷移を行う
*/

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../../api/auth";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("confirming");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const confirmationAttempted = useRef(false);

  useEffect(() => {
    const confirmEmail = async () => {
      if (confirmationAttempted.current) return;
      confirmationAttempted.current = true;

      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("error");
          setMessage("確認トークンが見つかりません");
          return;
        }

        const response = await authAPI.confirmEmail(token);
        setStatus("success");
        setMessage(response.message || "メールアドレスの確認が完了しました");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "確認に失敗しました");
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {status === "confirming" && (
            <div className="text-gray-600">メールアドレスを確認中...</div>
          )}
          {status === "success" && (
            <div className="text-green-600">
              {message}
              <p className="mt-2 text-sm">3秒後にホームページに移動します</p>
            </div>
          )}
          {status === "error" && (
            <div className="text-red-600">
              {message}
              <button
                onClick={() => navigate("/")}
                className="mt-4 block w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                ホームページに戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
