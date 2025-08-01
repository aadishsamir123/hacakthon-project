import { useState } from "react";

/**
 * useLoading Hook
 *
 * Custom React hook to manage loading states in components.
 * Features:
 * - Provides a boolean loading state
 * - Includes functions to start and stop loading
 * - Simplifies managing asynchronous operations in components
 */

/**
 * Custom hook for managing loading states with the LoadingScreen component
 * @param {string} defaultMessage - Default loading message
 * @returns {object} Loading state and control functions
 */
export const useLoading = (defaultMessage = "Loading...") => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const startLoading = (customMessage) => {
    if (customMessage) setMessage(customMessage);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const withLoading = async (asyncFunction, loadingMessage) => {
    try {
      startLoading(loadingMessage);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    withLoading,
    setMessage,
  };
};

export default useLoading;
