import request from 'supertest'
import { Drug } from '../../drugs/drugs.model'
import { ExpressServer } from '../../server'

jest.setTimeout(60000)

describe('GET /drugs/:drug/mappings', () => {
  const app = ExpressServer.getInstance().app
  let adminToken: string
  const defaultAdminCredentials = {
    email: 'admin@admin.com',
    password: 'admin',
  }

  beforeAll(async () => {
    const loginAdmin = await request(app).post('/auth/login').send(defaultAdminCredentials)
    adminToken = loginAdmin.body.token
  })

  it('should return a mapping when valid query params are provided', async () => {
    // Arrange
    await Drug.create({
      drug_name: 'Dupixent',
      indication: 'Asthma',
      icd10_code: 'J45.909',
    })
    await Drug.create({
      drug_name: 'Dupixent',
      indication: 'Test',
      icd10_code: '000ABC',
    })

    // Act
    const response = await request(app)
      .get('/drugs/dupixent/mappings')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ indication: 'Asthma', icd10Code: 'J45' })


    // Assert
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].drug_name).toBe('Dupixent')
  })

  it('should return 404 for unknown drug', async () => {
    // Arrange

    // Act
    const response = await request(app)
      .get('/drugs/unknown-drug/mappings')
      .set('Authorization', `Bearer ${adminToken}`)

    // Assert
    expect(response.status).toBe(404)
  })
})
