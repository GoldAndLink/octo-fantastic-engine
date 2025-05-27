'use client';

/**
 * @fileoverview Error Fallback Component
 * This component provides a user-friendly error display when an error occurs in the application.
 * It is designed to work with React Error Boundaries.
 */

/**
 * Props for the ErrorFallback component
 */
interface ErrorFallbackProps {
  /** The error that was caught */
  error: Error;
  /** Function to reset the error boundary and retry the operation */
  resetErrorBoundary: () => void;
}

/**
 * A component that displays error information and provides a retry option
 * 
 * @param props - Component props
 * @param props.error - The error object containing the error message
 * @param props.resetErrorBoundary - Function to reset the error state and retry
 * 
 * @example
 * <ErrorBoundary FallbackComponent={ErrorFallback}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div role="alert" className="p-4">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
      <pre className="mt-2 text-sm text-red-500">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}