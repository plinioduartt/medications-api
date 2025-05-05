import request from 'supertest'
import { DupixentMapping } from '../../database/models/dupixentMapping'
import { ExpressServer } from '../../server'

jest.setTimeout(60000)

describe('GET /drugs/:drug/mappings', () => {
  it('should return a mapping when valid query params are provided', async () => {
    // Arrange
    await DupixentMapping.create({
      drug_name: 'Dupixent',
      indication: 'Asthma',
      icd10_code: 'J45.909',
    })

    // Act
    const response = await request(ExpressServer.getInstance().app)
      .get('/drugs/dupixent/mappings')
      .query({ indication: 'Asthma', icd10Code: 'J45' })


    // Assert
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0].medication_name).toBe('Dupixent')
  })

  it('should return 404 for unknown drug', async () => {
    // Arrange

    // Act
    const response = await request(ExpressServer.getInstance().app)
      .get('/drugs/unknown-drug/mappings')

    // Assert
    expect(response.status).toBe(404)
  })
})
