import bcrypt from 'bcryptjs'

export interface IEncrypter {
    hash(password: string, saltRounds?: number): string
    compare(password: string, hash: string): boolean
}

export class BcryptEncrypter implements IEncrypter {
    hash(password: string, saltRounds: number = 10): string {
        return bcrypt.hashSync(password, saltRounds)
    }
    compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash)
    }
}