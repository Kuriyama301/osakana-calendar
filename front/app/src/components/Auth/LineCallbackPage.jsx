import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../Common/LoadingScreen";

const LineCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lineAuth } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        if (!code) {
          throw new Error("認証コードが見つかりません");
        }

        await lineAuth(code);
        navigate("/");
      } catch (err) {
        console.error("LINE Callback Error:", err);
        setError(err.message || "認証に失敗しました");
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, lineAuth]);

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
