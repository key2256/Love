import * as React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = '예상치 못한 오류가 발생했습니다.';
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            if (parsed.error.includes('insufficient permissions')) {
              errorMessage = '해당 작업을 수행할 권한이 없습니다.';
            } else {
              errorMessage = `데이터베이스 오류: ${parsed.error}`;
            }
          }
        }
      } catch (e) {
        // Not a JSON error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl shadow-zinc-200/50 border border-zinc-100 p-10 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-red-50 flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-black text-zinc-900 mb-4 tracking-tight">
              문제가 발생했습니다
            </h1>
            
            <p className="text-zinc-500 mb-10 leading-relaxed">
              {errorMessage}
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                페이지 새로고침
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full py-4 bg-white border-2 border-zinc-900 text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all active:scale-[0.98]"
              >
                <Home className="w-4 h-4" />
                홈으로 돌아가기
              </button>
            </div>

            {isFirestoreError && (
              <p className="mt-8 text-[10px] text-zinc-400 font-medium uppercase tracking-widest">
                Error Code: FIRESTORE_PERMISSION_DENIED
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
