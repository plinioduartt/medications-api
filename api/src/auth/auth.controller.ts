import { HttpRequest, HttpResponse } from "../shared/types/dtos"
import { generateToken } from "../shared/utils/generate-token.util"
import { ILoginUsecase } from './usecases/login.usecase'
import { IRegisterUsecase } from './usecases/register.usecase'

export class AuthController {
  constructor(
    private readonly loginUsecase: ILoginUsecase,
    private readonly registerUsecase: IRegisterUsecase
  ) { }

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Registers a new user and returns a token and user data.
   *     tags: [Auth]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 description: Full name of the user
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email address of the user
   *               password:
   *                 type: string
   *                 description: Password for the user account
   *               role:
   *                 type: string
   *                 enum: [ADMIN, COMMON]
   *                 description: Role of the user
   *     responses:
   *       201:
   *         description: User successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token
   *                 user:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *       400:
   *         description: Email unavailable
   *       403:
   *         description: Acess denied
   */
  async register(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { name, email, password, role = 'COMMON' } = req.body

    const response = await this.registerUsecase.execute({ name, email, password, role })

    if (!response.ok) {
      res.status(response.error.status).json({ message: response.error.message })
      return
    }

    res.status(201).json(response.value)
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     description: Authenticates a user and returns a token and user info.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User email
   *               password:
   *                 type: string
   *                 description: User password
   *     responses:
   *       200:
   *         description: Successful login
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT token
   *                 user:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     email:
   *                       type: string
   *       401:
   *         description: Unauthorized
   */
  async login(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { email, password } = req.body

    const response = await this.loginUsecase.execute({ email, password })

    if (!response.ok) {
      res.status(response.error.status).json({ message: response.error.message })
      return
    }

    res.status(200).json(response.value)
  }
}
