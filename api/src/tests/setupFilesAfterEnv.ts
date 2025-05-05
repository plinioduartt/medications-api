import { Database } from "../database/configuration"

beforeAll(async () => {
    await Database.connect()
})

afterAll(async () => {
    await Database.close()
})