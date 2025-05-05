import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authenticate } from '../shared/middlewares/auth'
import { isAdmin } from '../shared/middlewares/is-admin'

const authController = new AuthController()

const userRouter = Router()

userRouter.post('/register', [authenticate, isAdmin], authController.register.bind(authController))
userRouter.post('/login', [], authController.login.bind(authController))

export { userRouter }