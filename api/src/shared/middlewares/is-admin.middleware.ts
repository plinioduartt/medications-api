import { NextFunction, Request, Response } from 'express'

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Access denied' })
    return
  }

  next()
}
