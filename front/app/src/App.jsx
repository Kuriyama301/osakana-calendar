import { Component, Suspense, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CalendarProvider from "./contexts/CalendarContext";
import LoadingScreen from "./components/Common/LoadingScreen.jsx";
import AuthProvider from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import EmailConfirmation from "./components/Auth/EmailConfirmation";
import NewPasswordForm from "./components/Auth/NewPasswordForm";
import { CollectionsProvider } from "./contexts/CollectionsContext";
import { DeleteAccountProvider } from "./contexts/DeleteAccountContext";
import DeleteAccountModal from "./components/Auth/DeleteAccountModal";
import LineCallbackPage from "./components/Auth/LineCallbackPage";
import { useAuth } from "./hooks/useAuth";
import { tokenManager } from "./utils/tokenManager";
import client from "./api/client";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(_error, _errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Application error:", _error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-4">
            <p className="text-lg text-gray-700">
              予期せぬエラーが発生しました
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

function AuthParamsHandler({ children }) {
  const { user } = useAuth(); // setUserが提供されていないため、useAuthから必要な関数を取得
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const checkAuthParams = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const authSuccess = params.get("auth_success");
        const userDataStr = params.get("user_data");

        if (token && authSuccess && userDataStr) {
          console.log("Processing auth params from URL");
          const userDataResponse = JSON.parse(decodeURIComponent(userDataStr));
          const userData = userDataResponse.data.attributes;

          if (!userData) {
            throw new Error("Invalid user data format");
          }

          // 認証情報の保存
          tokenManager.setToken(token);
          tokenManager.setUser(userData);
          client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // lineAuthを使用して状態を更新
          if (typeof user === "undefined" || user === null) {
            await new Promise((resolve) => {
              tokenManager.setUser(userData);
              window.location.reload(); // 必要に応じてページをリロード
              resolve();
            });
          }

          // URLパラメータのクリーンアップ
          window.history.replaceState({}, "", "/");
          console.log("Auth params processed successfully");
        }
      } catch (error) {
        console.error("Error processing auth params:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkAuthParams();
  }, [user]);

  if (isProcessing) {
    return <LoadingScreen isOpen={true} />;
  }

  return children;
}

AuthParamsHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const hasVisited = localStorage.getItem("hasVisitedApp");
        const loadingDuration = hasVisited ? 300 : 1500;

        await new Promise((resolve) => setTimeout(resolve, loadingDuration));
        setIsInitialLoading(false);
        localStorage.setItem("hasVisitedApp", "true");
      } catch (error) {
        console.error("Initialization error:", error);
        setIsInitialLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthParamsHandler>
          <FavoritesProvider>
            <CollectionsProvider>
              <Router>
                <DeleteAccountProvider>
                  <CalendarProvider>
                    <div className="h-screen overflow-hidden">
                      <LoadingScreen isOpen={isInitialLoading} />
                      <Suspense fallback={<LoadingScreen isOpen={true} />}>
                        <main className="h-full">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route
                              path="/auth/confirm"
                              element={<EmailConfirmation />}
                            />
                            <Route
                              path="/reset-password"
                              element={<NewPasswordForm />}
                            />
                            <Route
                              path="/auth/line/callback"
                              element={<LineCallbackPage />}
                            />
                          </Routes>
                          <DeleteAccountModal />
                        </main>
                      </Suspense>
                    </div>
                  </CalendarProvider>
                </DeleteAccountProvider>
              </Router>
            </CollectionsProvider>
          </FavoritesProvider>
        </AuthParamsHandler>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
