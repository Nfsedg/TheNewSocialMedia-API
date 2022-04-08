const bcrypt = require('bcrypt')
const { app, server } = require('../index');
const supertest = require('supertest')
const User = require('../models/User')
const mongoose = require('mongoose')
const api = supertest(app)

describe('creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({
            name: "Edgar",
            username: "nfsedg",
            passwordHash
        })

        await user.save()
    })

    test('working creating new user', async () => {

        const newUser = {
            name: "Kira",
            username: "thekircat",
            password: "miaucat123"
        }
        
        await api.post('/user').send(newUser).expect(201).expect('Content-type', /application\/json/)
    })
    
    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})