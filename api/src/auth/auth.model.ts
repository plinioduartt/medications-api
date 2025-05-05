import { Schema, model } from "mongoose"

export type Role = 'ADMIN' | 'COMMON'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: Role
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'COMMON'], required: true },
})

export const User = model<IUser>('User', userSchema, 'users')