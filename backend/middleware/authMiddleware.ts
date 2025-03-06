import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const jwt_secret = process.env.JWT_SECRET!;

interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  exp: number;
  iat: number;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
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
  const token = req.cookies.token;
  if (token) {
    const result = verifyAccessToken(token);

    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' }); // fallback - token is undefined/missing (401)
  }
}

module.exports = authenticateToken;
