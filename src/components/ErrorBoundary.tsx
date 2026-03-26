import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-8 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-brand-surface border border-brand-gold/20 p-12 rounded-sm shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-cyan/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
                  <AlertTriangle className="w-10 h-10 text-brand-gold" />
                </div>
              </div>

              <h1 className="font-serif text-3xl text-white mb-4 tracking-tight">
                Anomalía en el <span className="italic text-brand-gold">Sistema</span>
              </h1>
              
              <p className="font-sans text-gray-400 text-sm leading-relaxed mb-10">
                Hemos detectado una interrupción en el flujo bio-digital. 
                Nuestros algoritmos están trabajando para restaurar la armonía.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-brand-gold text-brand-dark font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reiniciar Interfaz
                </button>
                
                <button
                  onClick={this.handleReset}
                  className="w-full py-4 border border-white/10 text-white font-sans text-xs uppercase tracking-widest hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Home className="w-4 h-4" />
                  Volver al Inicio
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-8 p-4 bg-black/40 rounded border border-red-500/20 text-left overflow-auto max-h-40">
                  <p className="font-mono text-[10px] text-red-400 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
