import mongoose from 'mongoose'
import { User } from '../../auth/user.model'
import { DrugIndication } from '../../drugs/drugs.model'
import { programsSeed } from './seeds/programs.seed'
import { usersSeed } from './seeds/users.seed'

export class MongoDBDatabase {
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
        DrugIndication.init(),
      ])

      await Promise.all([
        usersSeed(),
        programsSeed()
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
