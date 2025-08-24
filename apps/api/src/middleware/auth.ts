import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthRole = 'ADMIN' | 'MANAGER' | 'SUPPORT' | 'VENDOR' | 'CUSTOMER';

export interface AuthClaims {
  userId: string;
  role: AuthRole;
}

export function requireAuth(allowed?: AuthRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const secret = process.env.JWT_SECRET || 'devsecret';
      const payload = jwt.verify(token, secret) as AuthClaims;
      (req as any).user = payload;
      if (allowed && allowed.length && !allowed.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

