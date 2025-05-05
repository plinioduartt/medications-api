import { IUser, User } from "./user.model"

export interface IUserDAO {
    findUserByEmail(email: string): Promise<IUser | null>
    create(data: Omit<IUser, '_id'>): Promise<IUser>
}

export class MongooseUserDAO implements IUserDAO {
    async findUserByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email })
    }

    async create(data: IUser): Promise<IUser> {
        const user = new User(data)
        await user.save()
        return user
    }
}