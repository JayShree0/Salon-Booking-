import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 select-none">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">⚠️</span>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-extrabold tracking-widest uppercase">
                APPLICATION RECOVERY
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected interface issue occurred. You can reload this page or return to the main homepage.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-rose-300 font-mono text-left break-all max-h-24 overflow-y-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs transition-all cursor-pointer"
              >
                <span>Return to Homepage</span>
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

