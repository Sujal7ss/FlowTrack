/**
 * Authentication middleware for verifying JWT tokens and attaching user data to requests.
 *
 * This module provides middleware to protect routes by ensuring the request includes a valid
 * JWT token in the Authorization header. It verifies the token, retrieves the associated user,
 * and attaches user information to the request object for use in subsequent handlers.
 */

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import User from '../models/User';

/**
 * Interface representing the payload structure of a JWT token.
 */
interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Middleware function to require authentication for protected routes.
 *
 * Extracts the JWT token from the Authorization header, verifies it, and attaches
 * the authenticated user's data to the request object. If authentication fails,
 * responds with an appropriate error status.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 * @returns void - Calls next() on success or sends an error response.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = (jwt.verify as any)(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to req object (declared as any for simplicity)
    (req as any).user = { id: user._id, email: user.email };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
