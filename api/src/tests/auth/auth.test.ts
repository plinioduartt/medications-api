import request from 'supertest'
import { ExpressServer } from '../../server'

describe('Auth workflow', () => {
  const registerPayload = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'securePass123',
    role: 'COMMON',
  }

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(ExpressServer.getInstance().app)
        .post('/auth/register')
        .send(registerPayload)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        role: 'COMMON',
      })
    })

    it('should not allow duplicate emails', async () => {
      await request(ExpressServer.getInstance().app).post('/auth/register').send(registerPayload)

      const res = await request(ExpressServer.getInstance().app)
        .post('/auth/register')
        .send(registerPayload)

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Email unavailable')
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(ExpressServer.getInstance().app).post('/auth/register').send(registerPayload)
    })

    it('should login with correct credentials', async () => {
      const res = await request(ExpressServer.getInstance().app)
        .post('/auth/login')
        .send({ email: registerPayload.email, password: registerPayload.password })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('email', registerPayload.email)
    })

    it('should not login with wrong password', async () => {
      const res = await request(ExpressServer.getInstance().app)
        .post('/auth/login')
        .send({ email: registerPayload.email, password: 'wrongPassword' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })

    it('should not login with unregistered email', async () => {
      const res = await request(ExpressServer.getInstance().app)
        .post('/auth/login')
        .send({ email: 'unknown@example.com', password: '123456' })

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })
  })
})
