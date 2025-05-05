import { NextFunction, Request, Response } from 'express'

export type HttpRequest = Request
export type HttpResponse = Response
export type HttpNext = NextFunction
export type CustomError = {
  status: number
  message: string
}
export type Either<T, E> = { ok: true; value?: T } | { ok: false; error: E }
