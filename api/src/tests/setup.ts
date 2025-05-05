import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

beforeAll(() => {
  MongoMemoryServer.create()
    .then(async res => {
      mongoServer = res
      const uri = mongoServer.getUri()
      await mongoose.connect(uri)
      console.log('Connected to in-memory database.')
    })
})

afterAll(() => {
  mongoose.connection.dropDatabase()
    .then(() => {
      mongoose.connection.close()
        .then(() => {
          mongoServer.stop()
          console.log('In-memory database stopped.')
        })
    })
})
