import { Request, Response, NextFunction, RequestHandler } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

export const requireAuth = (excludePaths: string[] = []): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if the current path is in the exclude list
    if (excludePaths.some(path => req.path.startsWith(path))) {
      next();
      return;
    }
    
    if (req.isAuthenticated()) {
      next();
      return;
    }
    
    // For API routes, return JSON response
    if (req.path.startsWith('/auth/') || req.path.startsWith('/api/')) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // For web routes, redirect to login
    res.redirect('/login');
  };
}; 