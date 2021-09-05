const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_y4b01'

module.exports = isAuthenticated = async (req, res, next) => {

    const token = req.headers["authorization"].split(" ")[1]

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.json({
                message: err
            })
        } else {
            req.user = user
            next()
        }
    })
}