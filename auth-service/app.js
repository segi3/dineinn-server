const express = require('express')
const app = express()

const PORT = process.env.PORT || 3010

// TODO: refactor to new file
// connect to local mongodb
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dineinn-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) console.log(err)
    console.log(`Auth service db connected`)
})

app.use(express.json())

// TODO: refactor to new file
// model untuk route
const User = require('./Models/UserSchema')

// register route
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
        return res.json( {
            message: 'User already exists'
        })
    } else {
        const newUser = new User ({
            name,
            email,
            password // TODO hash password
        })
        newUser.save()

        return res.json(newUser)
    }
})

// login route
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        return res.json({
            message: `User doesn't exists`
        })
    } else {

        if (password !== user.password) {
            return res.json({
                message: 'Incorrect Password'
            })
        }

        const payload = {
            email,
            name: user.name
        }
        jwt.sign(payload, JWT_SECRET, (err, token) => {
            if (err) console.log(err)
            else {
                return res.json({
                    token: token
                })
            }
        })
    }
})

app.listen(PORT, () => {
    console.log(`Auth service is now running at ${PORT}`)
})