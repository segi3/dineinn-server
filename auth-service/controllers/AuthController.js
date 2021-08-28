const User = require('../models/UserSchema')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

// register account route
const register = async (req, res) => {
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
}

// login account route
const login = async (req, res) => {
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
}

module.exports = {
    register,
    login
}
