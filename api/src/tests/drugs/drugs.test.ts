import request from 'supertest'
import { DrugIndication } from '../../drugs/drugs.model'
import { ExpressServer } from '../../server'
import { generateRandomString } from '../../shared/utils/random-string-generator.util'

jest.setTimeout(60000)

describe('Drug indications mappings', () => {
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

  describe('GET /drugs/:drugName/indications', () => {
    it('should return a mapping when valid query params are provided', async () => {
      await DrugIndication.create({
        drug_name: 'Dupixent',
        indication: 'Asthma',
        icd10_code: 'J45.909',
      })
      await DrugIndication.create({
        drug_name: 'Dupixent',
        indication: 'Test',
        icd10_code: '000ABC',
      })

      const response = await request(app)
        .get('/drugs/dupixent/indications')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ indication: 'Asthma', icd10Code: 'J45' })


      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
      expect(response.body[0].drug_name).toBe('Dupixent')
    })

    it('should return 404 for unknown drug', async () => {
      const response = await request(app)
        .get('/drugs/unknown-drug/indications')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(404)
    })
  })

  describe('POST /drugs/:drugName/indications', () => {
    it('should create a new drug indication', async () => {
      const newIndication = {
        indication: 'Asthma',
        icd10Code: 'J45.909',
      }

      const response = await request(app)
        .post('/drugs/dupixent/indications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newIndication)

      expect(response.status).toBe(201)
      expect(response.body.drug_name).toBe('dupixent')
      expect(response.body.indication).toBe('Asthma')
      expect(response.body.icd10_code).toBe('J45.909')
    })

    it('should return 409 if indication already exists', async () => {
      await DrugIndication.create({
        drug_name: 'Dupixent',
        indication: 'Asthma',
        icd10_code: 'J45.909',
      })

      const newIndication = {
        indication: 'Asthma',
        icd10Code: 'J45.909',
      }

      const response = await request(app)
        .post('/drugs/dupixent/indications')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newIndication)

      expect(response.status).toBe(409)
      expect(response.body.message).toBe('Indication already exists for this drug and ICD-10 code')
    })
  })

  describe('GET /drugs/:drugName/indications/:indicationId', () => {
    it('should return a drug indication by ID', async () => {
      const drugName = generateRandomString()
      const indication = await DrugIndication.create({
        drug_name: drugName,
        indication: 'Asthma',
        icd10_code: 'J45.909',
      })
      const response = await request(app)
        .get(`/drugs/${drugName}/indications/${indication._id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.drug_name).toBe(drugName)
      expect(response.body.indication).toBe('Asthma')
      expect(response.body.icd10_code).toBe('J45.909')
    })

    it('should return 400 for an invalid indication ID', async () => {
      const response = await request(app)
        .get('/drugs/dupixent/indications/invalidId')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
    })
  })

  describe('PATCH /drugs/:drugName/indications/:indicationId', () => {
    it('should update an existing drug indication', async () => {
      const drugName = generateRandomString()
      const indication = await DrugIndication.create({
        drug_name: drugName,
        indication: 'Asthma',
        icd10_code: 'J45.909',
      })
      const updatedIndication = {
        indication: 'Severe Asthma',
      }

      const response = await request(app)
        .patch(`/drugs/${drugName}/indications/${indication._id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedIndication)

      expect(response.status).toBe(200)
      expect(response.body.indication).toBe('Severe Asthma')
    })

    it('should return 404 for a non-existent indication ID', async () => {
      const response = await request(app)
        .put('/drugs/dupixent/indications/invalidId')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ indication: 'Severe Asthma', icd10Code: 'J45.909' })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /drugs/:drugName/indications/:indicationId', () => {
    it('should delete a drug indication', async () => {
      const drugName = generateRandomString()
      const indication = await DrugIndication.create({
        drug_name: drugName,
        indication: 'Asthma',
        icd10_code: 'J45.909',
      })

      const response = await request(app)
        .delete(`/drugs/${drugName}/indications/${indication._id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(204)
    })

    it('should return 400 for a invalid indication ID', async () => {
      const response = await request(app)
        .delete('/drugs/dupixent/indications/invalidId')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
    })
  })
})
