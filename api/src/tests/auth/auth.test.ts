import request from 'supertest'
import { ExpressServer } from '../../server'
import { generateRandomString } from '../../shared/utils/random-string-generator'

describe('Auth workflow', () => {
  const app = ExpressServer.getInstance().app

  const commonUserFactory = () => ({
    name: 'Test common user',
    email: `${generateRandomString()}@example.com`,
    password: 'securePass123',
    role: 'COMMON',
  })

  const defaultAdminCredentials = {
    email: 'admin@admin.com',
    password: 'admin',
  }

  let adminToken: string

  beforeAll(async () => {
    const loginAdmin = await request(app).post('/auth/login').send(defaultAdminCredentials)
    adminToken = loginAdmin.body.token
  })

  describe('POST /auth/register', () => {
    it('should deny access to register without token', async () => {
      const res = await request(app).post('/auth/register').send(commonUserFactory())
      expect(res.status).toBe(401)
    })

    it('should deny access to register with non-admin token', async () => {
      const commonUser = commonUserFactory()

      await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(commonUser)

      const loginCommon = await request(app)
        .post('/auth/login')
        .send({
          email: commonUser.email,
          password: commonUser.password,
        })

      const res = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${loginCommon.body.token}`)
        .send(commonUser)

      expect(res.status).toBe(403)
    })

    it('should register a new user with admin token', async () => {
      const commonUser = commonUserFactory()

      const res = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(commonUser)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toMatchObject({
        name: commonUser.name,
        email: commonUser.email,
        role: 'COMMON',
      })
    })

    it('should not allow duplicate emails', async () => {
      const commonUser = commonUserFactory()

      await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(commonUser)

      const res = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(commonUser)

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Email unavailable')
    })
  })

  describe('POST /auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(defaultAdminCredentials)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('email', defaultAdminCredentials.email)
    })

    it('should not login with wrong password', async () => {
      const commonUser = commonUserFactory()

      const res = await request(app)
        .post('/auth/login')
        .send({ email: commonUser.email, password: 'wrongPassword' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })

    it('should not login with unregistered email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'unknown@example.com', password: '123456' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })
  })
})
