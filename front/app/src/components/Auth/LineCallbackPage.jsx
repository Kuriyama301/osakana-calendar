/**
* LINE認証のコールバック画面のコンポーネント
* LINE認証後に受け取ったコードを処理して、認証の結果を表示する
*/

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingScreen from "../Common/LoadingScreen";

const LineCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        if (!code) {
          throw new Error("認証コードが見つかりません");
        }

        // フォールバック値を含む環境変数の設定
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "https://osakana-calendar-api-7fca63533648.herokuapp.com";

        // URLの生成とリダイレクト
        const callbackUrl = `${apiUrl}/api/v1/auth/line/callback?code=${code}`;
        console.log("Redirecting to:", callbackUrl);

        window.location.href = callbackUrl;
      } catch (err) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">認証エラー</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <LoadingScreen isOpen={isProcessing} />;
};

export default LineCallbackPage;
