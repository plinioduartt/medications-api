import { ObjectId } from 'mongodb'
import request from 'supertest'
import { DrugIndication } from '../../drugs/drugs.model'
import { Program } from '../../programs/program.model'
import { ExpressServer } from '../../server'
import { generateRandomString } from '../../shared/utils/random-string-generator.util'

jest.setTimeout(60000)

describe('Programs', () => {
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

  it('should fetch a program by ID with all drug indications', async () => {
    const drugIndication = await DrugIndication.create([
      { drug_name: 'dupixent', icd10_code: 'A01', indication: "Lorem ipsum" },
      { drug_name: 'dupixent', icd10_code: 'B01', indication: "Lorem ipsum" },
      { drug_name: generateRandomString(), icd10_code: 'B01', indication: "Lorem ipsum" },
    ])

    const program = await Program.create({
      name: 'Test Program',
      description: 'Test description',
      drugIndications: drugIndication.map(ind => ind._id),
    })

    const response = await request(app)
      .get(`/programs/${program._id}?includeIndications=true`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(response.body.name).toBe('Test Program')
    expect(response.body.description).toBe('Test description')
    expect(response.body.drugIndications.length).toBe(3)
  })

  it('should fetch a program by ID without indications', async () => {
    const drugIndication = await DrugIndication.create([
      { drug_name: 'dupixent', icd10_code: 'A01', indication: "Lorem ipsum" },
      { drug_name: 'dupixent', icd10_code: 'B01', indication: "Lorem ipsum" },
      { drug_name: generateRandomString(), icd10_code: 'B01', indication: "Lorem ipsum" },
    ])

    const program = await Program.create({
      name: 'Test Program',
      description: 'Test description',
      drugIndications: drugIndication.map(ind => ind._id),
    })

    const response = await request(app)
      .get(`/programs/${program._id}?drugName=dupixent`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)

    expect(response.body.name).toBe('Test Program')
    expect(response.body.description).toBe('Test description')
    expect(response.body.drugIndications.length).toBe(2)
  })

  it('should return 400 for a invalid id', async () => {
    const response = await request(app)
      .get('/programs/invalid_id')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)

    expect(response.body.message).toBe('Invalid programId')
  })

  it('should return 404 if program not found', async () => {
    const mockId = new ObjectId()
    const response = await request(app)
      .get(`/programs/${mockId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404)

    expect(response.body.message).toBe('Program not found')
  })
})
