import { timeStamp } from 'console';
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
}

/**
 * Zentralisierter Error Handler
 * Fängt alle Fehler/errors und sendet konsistente Fehlerantworten zurück
 */
export function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

  console.error(`❌ Error [${status}]:`, message);

  res.status(status).json({
    error: message,
    status,
    timeStamp: new Date().toISOString()
  });
}