// FILE: src/middleware/security.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// define the User type so TypeScript doesn't complain
declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
    }
  }
}

// THE GUARD FUNCTION
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const secret = process.env.JWT_SECRET || "fallback-dev-secret";
    const decoded = jwt.verify(token, secret) as Express.User;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};