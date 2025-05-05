import { Database } from "../shared/database/configuration"

beforeAll(async () => {
    await Database.connect()
})

afterAll(async () => {
    await Database.close()
})