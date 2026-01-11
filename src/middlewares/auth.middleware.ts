import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  req.user = jwt.verify(token, process.env.JWT_SECRET!);
  next();
};
