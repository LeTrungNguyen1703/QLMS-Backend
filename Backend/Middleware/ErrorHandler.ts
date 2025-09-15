import { Request, Response, NextFunction } from 'express';
import { APIResponseError } from '../DTO/Response/APIResponse';

// Custom error class for API errors
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized error handling middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Handle validation errors specifically
  if (err instanceof AppError && err.statusCode === 400) {
    return res
      .status(400)
      .json(new APIResponseError(err.message));
  }

  if (err instanceof AppError) {
    // Handle operational errors (expected errors)
    return res
      .status(err.statusCode)
      .json(new APIResponseError(err.message));
  }

  // Handle unexpected errors
  return res
    .status(500)
    .json(new APIResponseError('Có lỗi xảy ra, vui lòng thử lại sau'));
};

// Async function wrapper to eliminate try-catch boilerplate
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
