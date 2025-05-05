import bcrypt from 'bcryptjs'
import { generateToken } from "../shared/utils/generate-token"
import { HttpRequest, HttpResponse } from "../shared/types/dtos"
import { User } from "./auth.model"

export class AuthController {
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

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'Email unavailable' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword, role })
    await user.save()

    res.status(201).json({
      token: generateToken(user._id.toString(), user.role),
      user: { name, email, role },
    })
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

    const user = await User.findOne({ email })
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    res.status(200).json({
      token: generateToken(user._id.toString(), user.role),
      user: { name: user.name, email: user.email }
    })
  }
}
