import jwt from 'jsonwebtoken'
import { Role } from '../../auth/user.model'

export const generateToken = (userId: string, role: Role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    })
}