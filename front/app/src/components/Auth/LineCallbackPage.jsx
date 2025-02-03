import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../Common/LoadingScreen";
import { tokenManager } from "../../utils/tokenManager";
import client from "../../api/client";

const LineCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  // コンポーネントのマウント時のデバッグ
  useEffect(() => {
    console.log("LineCallbackPage mounted. Current URL:", window.location.href);
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      // デバッグログを保存する関数
      const saveDebugLog = (step, data) => {
        const logs = JSON.parse(
          localStorage.getItem("LINE_AUTH_DEBUG") || "[]"
        );
        logs.push({
          timestamp: new Date().toISOString(),
          step,
          data,
        });
        localStorage.setItem("LINE_AUTH_DEBUG", JSON.stringify(logs));
      };

      try {
        saveDebugLog("INIT", {
          url: window.location.href,
          hasToken: !!searchParams.get("token"),
          hasAuthSuccess: !!searchParams.get("auth_success"),
          hasUserData: !!searchParams.get("user_data"),
        });

        const token = searchParams.get("token");
        const authSuccess = searchParams.get("auth_success");
        const userDataStr = searchParams.get("user_data");

        if (!token || !authSuccess || !userDataStr) {
          saveDebugLog("ERROR", { message: "認証パラメータが不足しています" });
          throw new Error("認証パラメータが不足しています");
        }

        try {
          const parsedUserData = JSON.parse(decodeURIComponent(userDataStr));
          saveDebugLog("USER_DATA_PARSED", {
            id: parsedUserData.data?.id,
            email: parsedUserData.data?.attributes?.email,
          });

          tokenManager.setToken(token);
          saveDebugLog("TOKEN_SAVED", { success: !!tokenManager.getToken() });

          tokenManager.setUser(parsedUserData);
          saveDebugLog("USER_SAVED", { success: !!tokenManager.getUser() });

          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          saveDebugLog("AUTH_HEADER_SET", {
            token: token.substring(0, 10) + "...",
          });

          setUser(parsedUserData);
          saveDebugLog("AUTH_CONTEXT_UPDATED", { success: true });

          navigate("/", { replace: true });
          saveDebugLog("NAVIGATION_TRIGGERED", { destination: "/" });
        } catch (err) {
          saveDebugLog("ERROR", {
            message: err.message,
            stack: err.stack,
          });
          throw err;
        }
      } catch (err) {
        setError(err.message);
        tokenManager.clearAll();
        delete client.defaults.headers.common["Authorization"];
        saveDebugLog("CLEANUP", { error: err.message });
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  // エラー表示
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
