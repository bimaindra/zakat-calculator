import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

export interface ErrorDetails {
  message: string;
  code?: string;
  context?: Record<string, any>;
}

export const useErrorHandler = () => {
  const toast = useToast();

  const handleError = useCallback(
    (
      error: Error | ErrorDetails | string,
      options?: {
        showToast?: boolean;
        logError?: boolean;
      }
    ) => {
      const { showToast = true, logError = true } = options || {};

      let errorMessage: string;
      let errorContext: Record<string, any> | undefined;

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorContext = { stack: error.stack };
      } else {
        errorMessage = error.message;
        errorContext = error.context;
      }

      if (logError) {
        console.error('Application error:', {
          message: errorMessage,
          context: errorContext,
          timestamp: new Date().toISOString(),
        });
      }

      if (showToast) {
        toast({
          title: 'Terjadi kesalahan',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      return {
        message: errorMessage,
        context: errorContext,
      };
    },
    [toast]
  );

  const handleCalculationError = useCallback(
    (error: Error | string) => {
      const errorMessage = typeof error === 'string' ? error : error.message;

      return handleError({
        message: `Gagal melakukan perhitungan: ${errorMessage}`,
        code: 'CALCULATION_ERROR',
        context: { originalError: error },
      });
    },
    [handleError]
  );

  const handleValidationError = useCallback(
    (fieldName: string, validationMessage: string) => {
      return handleError(
        {
          message: `Validasi gagal pada field ${fieldName}: ${validationMessage}`,
          code: 'VALIDATION_ERROR',
          context: { field: fieldName, validation: validationMessage },
        },
        { showToast: false }
      ); // Don't show toast for validation errors, they're shown inline
    },
    [handleError]
  );

  const handleNetworkError = useCallback(
    (error: Error | string) => {
      const errorMessage = typeof error === 'string' ? error : error.message;

      return handleError({
        message: `Terjadi masalah jaringan: ${errorMessage}`,
        code: 'NETWORK_ERROR',
        context: { originalError: error },
      });
    },
    [handleError]
  );

  return {
    handleError,
    handleCalculationError,
    handleValidationError,
    handleNetworkError,
  };
};
