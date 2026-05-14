import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Middleware die JWT token verifiziert
 * Ruft diesen die protected routes auf die ein Login brauchen
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  //Holt Token aus Authorization Header (Format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login first.' });
  }

  try {
    // Verifiziert Token und extrahiert User Informationen
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      username: string;
    };

    // Fügt user info zu to request für den nutzen in controllers
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
}