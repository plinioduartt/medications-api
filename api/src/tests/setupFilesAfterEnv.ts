import { MongoDBDatabase } from "../shared/database/mongodb.configuration"

beforeAll(async () => {
    await MongoDBDatabase.connect()
})

afterAll(async () => {
    await MongoDBDatabase.close()
})