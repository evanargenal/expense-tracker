import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { AuthenticatedUser } from '../types/types';

const jwt_secret = process.env.JWT_SECRET!;

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

function verifyAccessToken(token: string): {
  success: boolean;
  data?: any;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    return { success: true, data: decoded };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies.token;
  if (accessToken) {
    const result = verifyAccessToken(accessToken);

    if (!result.success) {
      return res.status(401).json({ error: result.error }); // Token expired or invalid
    }

    req.user = result.data;
    next();
  } else {
    return res.status(401).json({ error: 'Access token missing' }); // fallback - token is undefined/missing (401)
  }
}

module.exports = authenticateToken;
