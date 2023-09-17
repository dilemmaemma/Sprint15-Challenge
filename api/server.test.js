const request = require('supertest')

const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('auth-router.js', () => {
  describe('[POST] /api/auth/register', () => {
    it('[1] responds with correct status upon successful entry', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })

      expect(res.status).toBe(201)
    })

    it('[2] responds with correct message and status upon leaving out username', async () => {
      const res = await request(server).post('/api/auth/register').send({ password: 'Monkeybread' })

      expect(res.body.message).toEqual("username and password required")
      expect(res.status).toBe(400)
    })

    it('[3] responds with correct message and status upon leaving out password', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Dunky' })

      expect(res.body.message).toEqual("username and password required")
      expect(res.status).toBe(400)
    })

    it('[4] responds with correct message and status on creating too short of a password', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'po' })

      expect(res.body.message).toEqual("password must be longer than 3 chars")
      expect(res.status).toBe(422)
    })

    it('[5] responds with correct message and status on creating a username that already exists', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'PorkAndBeans' })

      expect(res.body.message).toEqual("username taken")
      expect(res.status).toBe(422)
    })
  })

  describe('[POST] /api/auth/login', () => {
    it('[6] responds with correct message upon successful entry', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/login').send({ username: 'Dunky', password: 'Frenchfries' })

      expect(res.body.message).toEqual( 'welcome, Dunky' )
    })

    it('[7] responds with correct message and status upon invalid password', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/login').send({ username: 'Dunky', password: 'Pork' })

      expect(res.body.message).toEqual('invalid credentials')
      expect(res.status).toBe(401)
    })

    it('[8] responds with correct message and status upon invalid username', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/login').send({ username: 'Dumky', password: 'Frenchfries' })

      expect(res.body.message).toEqual('invalid credentials')
      expect(res.status).toBe(401)
    })

    it('[9] responds with correct message and status upon leaving out username', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/login').send({ password: 'Monkeybread' })

      expect(res.body.message).toEqual("username and password required")
      expect(res.status).toBe(400)
    })

    it('[10] responds with correct message and status upon leaving out password', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      const res = await request(server).post('/api/auth/login').send({ username: 'Dunky' })

      expect(res.body.message).toEqual("username and password required")
      expect(res.status).toBe(400)
    })

  })
})

describe('jokes-router.js', () => {
  describe('[GET] /api/jokes', () => {
    it('[11] responds with correct message and status upon failing restriction', async () => {
      const res = await request(server).get('/api/jokes')

      expect(res.body).toEqual('token required')
      expect(res.status).toBe(401)
    })

    it('[12] responds with correct message and status upon successful entry', async () => {
      const jokes = [
        {
          "id": "0189hNRf2g",
          "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
        },
        {
          "id": "08EQZ8EQukb",
          "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
        },
        {
          "id": "08xHQCdx5Ed",
          "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
        },
      ];
      
      await request(server).post('/api/auth/register').send({ username: 'Dunky', password: 'Frenchfries' })
      await request(server).post('/api/auth/login').send({ username: 'Dunky', password: 'Frenchfries' })

      const res = await request(server).get('/api/jokes')

      expect(res.body).toEqual(jokes)
    })
  })
})