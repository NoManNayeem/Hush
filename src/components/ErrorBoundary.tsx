'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, Bug, Github } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error | undefined
  errorId?: string | undefined
  retryCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      retryCount: 0
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // Log error details for debugging
    this.logError(error, errorInfo)
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: this.state.retryCount
    }

    // Store error in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('hush:errors') || '[]')
      existingErrors.push(errorDetails)
      // Keep only last 10 errors
      const recentErrors = existingErrors.slice(-10)
      localStorage.setItem('hush:errors', JSON.stringify(recentErrors))
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }

  handleReset = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorId: undefined,
      retryCount: prevState.retryCount + 1 
    } as State))
  }

  handleReportError = () => {
    const { error, errorId } = this.state
    if (!error) return

    // Create GitHub issue URL
    const issueTitle = `Error Report: ${error.message.substring(0, 50)}`
    const issueBody = `**Error ID:** ${errorId}\n\n**Error Message:**\n\`\`\`\n${error.message}\n\`\`\`\n\n**Stack Trace:**\n\`\`\`\n${error.stack}\n\`\`\`\n\n**URL:** ${window.location.href}\n**Timestamp:** ${new Date().toISOString()}\n**User Agent:** ${navigator.userAgent}`

    const githubUrl = `https://github.com/NoManNayeem/Hush/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`

    window.open(githubUrl, '_blank')
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
          <div className="max-w-lg w-full text-center">
            <div className="mb-8">
              <div className="relative">
                <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-6 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <Bug className="h-4 w-4 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Oops! Something went wrong</h1>
              <p className="text-gray-400 mb-2">
                We encountered an unexpected error. Our team has been notified and we're working to fix it.
              </p>
              {this.state.errorId && (
                <p className="text-sm text-gray-500 mb-6">
                  Error ID: <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">{this.state.errorId}</code>
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={this.handleReset}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={this.handleReportError}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white mb-4">
                  Error Details (Development Mode)
                </summary>
                <div className="bg-gray-900 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Error Message:</h4>
                    <pre className="text-xs text-red-300 bg-gray-800 p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-red-300 bg-gray-800 p-2 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>Retry Count: {this.state.retryCount}</p>
                    <p>Timestamp: {new Date().toISOString()}</p>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Enhanced hook-based error handler
export function useErrorHandler() {
  return (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // Log error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // Store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('hush:errors') || '[]')
      existingErrors.push(errorDetails)
      localStorage.setItem('hush:errors', JSON.stringify(existingErrors.slice(-10)))
    } catch (e) {
      console.error('Failed to log error:', e)
    }
  }
}

// Error reporting utility
export function reportError(error: Error, context?: string) {
  const errorReport = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }

  console.error('Error reported:', errorReport)
  
  // In production, you might want to send this to an error reporting service
  // like Sentry, LogRocket, or Bugsnag
}
