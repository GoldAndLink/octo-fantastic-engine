import { toast } from 'sonner';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: Error | AppError | unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error details:', error);
  }

  if (error instanceof AppError) {
    toast.error(error.message);
    return error;
  }

  if (error instanceof Error) {
    toast.error('An unexpected error occurred. Please try again later.');
    return new AppError(error.message);
  }

  toast.error('An unexpected error occurred. Please try again later.');
  return new AppError('Unknown error occurred');
};

export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};

export const errorMessages = {
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  RATE_LIMIT: 'Too many requests. Please try again later',
} as const;

export const throwError = (message: string, statusCode?: number) => {
  throw new AppError(message, statusCode);
};