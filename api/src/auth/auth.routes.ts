import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authenticate } from '../shared/middlewares/auth.middleware'
import { isAdmin } from '../shared/middlewares/is-admin.middleware'
import { LoginUsecase } from './usecases/login.usecase'
import { BcryptEncrypter } from '../shared/utils/encrypter.util'
import { MongooseUserDAO } from './user.dao'
import { RegisterUsecase } from './usecases/register.usecase'

const encrypter = new BcryptEncrypter()
const userDAO = new MongooseUserDAO()
const loginUsecase = new LoginUsecase(encrypter, userDAO)
const registerUsecase = new RegisterUsecase(encrypter, userDAO)
const authController = new AuthController(loginUsecase, registerUsecase)

const userRouter = Router()

userRouter.post('/register', [authenticate, isAdmin], authController.register.bind(authController))
userRouter.post('/login', [], authController.login.bind(authController))

export { userRouter }