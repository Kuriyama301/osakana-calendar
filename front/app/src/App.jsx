import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Header } from './components';
import { CalendarProvider } from './CalendarContext.jsx';

// ローディングコンポーネント
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
);

// エラーバウンダリーコンポーネント
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Something went wrong. Please try refreshing the page.</p>
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