import mongoose from 'mongoose'
import { User } from '../../auth/auth.model'
import { Drug } from '../../drugs/drugs.model'
import { usersSeed } from './seeds/users'

export class Database {
  private static instance: mongoose.Mongoose

  /** Alias to singleton */
  static async connect(): Promise<void> {
    await this.getInstance()
  }

  static async getInstance(): Promise<mongoose.Mongoose | undefined> {
    try {
      if (this.instance) return this.instance
      if (!process.env.MONGODB_URI) throw new Error('Missing env var: MONGODB_URI')

      const uri = process.env.MONGODB_URI
      this.instance = await mongoose.connect(uri, {
        dbName: process.env.MONGODB_NAME,
        serverSelectionTimeoutMS: 5000,
      })

      await Promise.all([
        User.init(),
        Drug.init(),
      ])

      await Promise.all([
        usersSeed()
      ])

      console.log('Connected using Mongoose')

      return this.instance
    } catch (error) {
      console.log('Database error', error)
    }
  }

  static async close(): Promise<void> {
    await mongoose.disconnect()
    console.log('Connection closed.')
  }
}
