import { JwtPayload } from "jsonwebtoken";

import { JwtUserPayload } from "../types/jwt"; // wherever you define it

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUserPayload; // now TS knows user has id & role
  }
}

declare module "bcryptjs";



declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload; // depends on what you store in JWT
  }
}



import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Add custom properties here if needed
    }
  }
}