import { Router } from 'express'
import { AuthController } from './auth.controller'

const authController = new AuthController()

const userRouter = Router()

userRouter.post('/register', [], authController.register.bind(authController))
userRouter.post('/login', [], authController.login.bind(authController))

export { userRouter }