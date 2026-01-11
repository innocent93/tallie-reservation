import { Request, Response, NextFunction } from "express";

const errorHandler = (err, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    error: message
  });
};

export default errorHandler;