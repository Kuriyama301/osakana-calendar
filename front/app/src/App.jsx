import { Component, Suspense, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Header } from "./components";
import { CalendarProvider } from "./CalendarContext.jsx";
import LoadingScreen from "./components/Common/LoadingScreen.jsx";

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
      <CalendarProvider>
        <Router>
          <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
            <LoadingScreen isOpen={isInitialLoading} />
            <Header className="flex-shrink-0" />
            <Suspense fallback={<LoadingScreen isOpen={true} />}>
              <main className="flex-grow overflow-hidden">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </main>
            </Suspense>
          </div>
        </Router>
      </CalendarProvider>
    </ErrorBoundary>
  );
}

export default App;
