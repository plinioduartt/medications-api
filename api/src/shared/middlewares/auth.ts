import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '../../auth/auth.model'

interface AuthPayload {
  userId: string
  role: Role
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET || 'your-default-secret'
    const decoded = jwt.verify(token, secret) as AuthPayload

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }
}
