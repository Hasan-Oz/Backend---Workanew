// FILE: src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Tell TypeScript that 'req.user' exists
declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
    }
  }
}

// 2. The Security Guard Function
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback-dev-secret";
    // Verify the token
    const decoded = jwt.verify(token, secret) as Express.User;
    req.user = decoded; 
    next(); // Pass!
  } catch (error) {
    return res.status(403).json({ error: "Invalid token." });
  }
};