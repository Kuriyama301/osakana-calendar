import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Header } from './components';
import { CalendarProvider } from './CalendarContext.jsx';

const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center p-4">
            <p className="text-lg text-gray-700">予期せぬエラーが発生しました</p>
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

function App() {
  return (
    <ErrorBoundary>
      <CalendarProvider>
        <Router>
          <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
            <Header className="flex-shrink-0" />
            <Suspense fallback={<Loading />}>
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