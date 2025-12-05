import { Request, Response, NextFunction } from 'express';

/**
 * Simple request logger middleware
 * Logs: status code, method, path, and errors/warnings
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const path = req.originalUrl || req.url;

  // Skip logging for any path containing /health
  if (path.includes('/health')) {
    next();
    return;
  }

  const originalSend = res.send;

  res.send = function (body) {
    const statusCode = res.statusCode;
    const method = req.method;

    if (statusCode >= 500) {
      // Server error
      let errorMsg = '';
      try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        errorMsg = parsed.error || '';
      } catch {
        errorMsg = '';
      }
      console.error(`[ERROR] ${statusCode} ${method} ${path}${errorMsg ? ` - ${errorMsg}` : ''}`);
    } else if (statusCode >= 400) {
      // Client error (warning)
      let warningMsg = '';
      try {
        const parsed = typeof body === 'string' ? JSON.parse(body) : body;
        warningMsg = parsed.error || '';
      } catch {
        warningMsg = '';
      }
      console.warn(`[WARNING] ${statusCode} ${method} ${path}${warningMsg ? ` - ${warningMsg}` : ''}`);
    } else {
      // Success
      console.log(`${statusCode} ${method} ${path}`);
    }

    return originalSend.call(this, body);
  };

  next();
};
