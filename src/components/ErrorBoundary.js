import React from "react";
import PropTypes from "prop-types";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} className="text-brand" />
            </div>
            <h1 className="font-display font-bold text-2xl text-charcoal mb-2">
              Something went wrong
            </h1>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              An unexpected error occurred. Please refresh the page or go back to
              the home page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              <a href="/" className="btn-secondary">
                <Home size={16} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
