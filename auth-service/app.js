const dotenv = require('dotenv'); dotenv.config()

const express = require('express')
const app = express()

const PORT = process.env.PORT || 3010

// connect to local mongodb
const mongodb = require('./utils/mongodb')

app.use(express.json())

// route
const AuthRoutes = require('./routes/AuthRoute')

app.use('/auth', AuthRoutes)

app.listen(PORT, async () => {
    console.log(`${process.env.SERVICE_NAME} is now running at ${PORT}`)
    await mongodb()
})