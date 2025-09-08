import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for operational errors.
 */
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

/**
 * Global error handling middleware.
 *
 * Catches and handles errors thrown in the application, logging them
 * and sending appropriate JSON responses to the client.
 *
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function (not used here).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID';
  } else if ((err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Log the error
  console.error(`Error ${statusCode}: ${message}`, err);

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};


// import { Request, Response, NextFunction } from 'express';

// export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
//   console.error(err);
//   const status = err.status || 500;
//   const body = { error: err.message || 'Internal Server Error' };
//   res.status(status).json(body);
// }
