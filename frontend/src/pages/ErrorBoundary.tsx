import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleGoHome = () => {
    window.location.href = "/admin/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div
            className="card shadow-sm p-4 text-center"
            style={{ maxWidth: 420 }}
          >
            <h2 className="text-warning mb-2">Under Development</h2>
            <p className="text-muted mb-4">
              The <strong>All Task Board</strong> section is currently under
              development and will be available soon.
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-primary"
                onClick={this.handleGoHome}
              >
                Go to Dashboard
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
