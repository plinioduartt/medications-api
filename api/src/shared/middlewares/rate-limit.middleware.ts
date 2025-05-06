import { NextFunction, Request, Response } from 'express'

interface RateLimitOptions {
  maxRequests: number
  timeWindow: number
}

export const rateLimit = ({ maxRequests, timeWindow }: RateLimitOptions) => {
  const ipStore = new Map<string, { count: number; firstRequest: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip!

    const now = Date.now()
    const entry = ipStore.get(ip)

    if (!entry) {
      ipStore.set(ip, { count: 1, firstRequest: now })
      return next()
    }

    const elapsed = now - entry.firstRequest

    if (elapsed > timeWindow) {
      ipStore.set(ip, { count: 1, firstRequest: now })
      return next()
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({ message: 'Too many requests. Please try again later.' })
      return
    }

    entry.count += 1
    return next()
  }
}