import { CustomError, Either } from "../../shared/types/dtos"
import { IEncrypter } from "../../shared/utils/encrypter.util"
import { generateToken } from "../../shared/utils/generate-token.util"
import { IUserDAO } from "../user.dao"
import { Role } from "../user.model"

export type RegisterRequest = { name: string, email: string, password: string, role: Role }
export type RegisterResponse = {
  token: string,
  user: { name: string, email: string, role: string }
}
export interface IRegisterUsecase {
  execute(credentials: RegisterRequest): Promise<Either<RegisterResponse, CustomError>>
}

export class RegisterUsecase implements IRegisterUsecase {
  constructor(
    private readonly encrypter: IEncrypter,
    private readonly userDAO: IUserDAO
  ) { }

  async execute(payload: RegisterRequest): Promise<Either<RegisterResponse, CustomError>> {
    const existingUser = await this.userDAO.findUserByEmail(payload.email)
    if (existingUser) return { ok: false, error: { status: 400, message: 'Email unavailable' } }

    const hashedPassword = this.encrypter.hash(payload.password)
    const user = await this.userDAO.create({ ...payload, password: hashedPassword })

    return {
      ok: true,
      value: {
        token: generateToken(user._id.toString(), payload.role),
        user: { name: payload.name, email: payload.email, role: payload.role },
      }
    }
  }
}