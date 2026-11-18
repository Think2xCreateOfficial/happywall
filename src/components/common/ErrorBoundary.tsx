"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Happy Walls Component Error Caught by Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-6 p-6 rounded-2xl bg-charcoal-card border border-red-500/20 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-manrope font-extrabold text-base text-white mb-1">
            {this.props.fallbackTitle || "Something went wrong displaying this section"}
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mb-4">
            {this.props.fallbackMessage ||
              "An unexpected error occurred. You can continue browsing other collections or try refreshing."}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={this.handleReset}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

