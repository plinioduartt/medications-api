import { CustomError, Either } from "../../shared/types/dtos"
import { IEncrypter } from "../../shared/utils/encrypter.util"
import { generateToken } from "../../shared/utils/generate-token.util"
import { IUserDAO } from "../user.dao"

export type LoginRequest = { email: string, password: string }
export type LoginResponse = {
  token: string,
  user: { name: string, email: string }
}
export interface ILoginUsecase {
  execute(credentials: LoginRequest): Promise<Either<LoginResponse, CustomError>>
}

export class LoginUsecase implements ILoginUsecase {
  constructor(
    private readonly encrypter: IEncrypter,
    private readonly userDAO: IUserDAO
  ) { }

  async execute(credentials: LoginRequest): Promise<Either<LoginResponse, CustomError>> {
    const user = await this.userDAO.findUserByEmail(credentials.email)
    if (!user) return { ok: false, error: { message: 'Unauthorized', status: 401 } }

    const isMatch = this.encrypter.compare(credentials.password, user.password)
    if (!isMatch) return { ok: false, error: { message: 'Unauthorized', status: 401 } }

    return {
      ok: true,
      value: {
        token: generateToken(user._id.toString(), user.role),
        user: { name: user.name, email: user.email }
      }
    }
  }
}