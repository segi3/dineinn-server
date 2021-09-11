const express = require("express")
const app = express()

const PORT = process.env.PORT_ONE || 3020

// connect to local mongodb
const mongodb = require('./utils/mongodb')

app.use(express.json())

// rabbit mq
// docker run -p 5672:5672 -p 15672:15672 rabbitmq:management

// route
const ProductRoutes = require('./routes/ProductRoute')
const isAuthenticated = require("../utils/middleware/isAuthenticated")

app.use('/product', ProductRoutes)

// // crud product tmp
// const Product = require('./models/ProductSchema')
// const isAuthenticated = require('../utils/middleware/isAuthenticated')

// app.post('/product/create', isAuthenticated, (req, res) => {

//     const { name, description, price } = req.body

//     const newProduct = new Product({
//         name,
//         description,
//         price
//     })
//     newProduct.save()

//     return res.json(newProduct)
// })

// app.post('/product/buy', isAuthenticated, async (req, res) => {

//     const { ids } = req.body
//     const products = await Product.find({ _id: { $in: ids } })

//     channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({
//         products,
//         userEmail: req.user.email
//     })))
// })



app.listen(PORT, async () => {
    console.log(`${process.env.SERVICE_NAME || 'Product-Service' } is now running at ${PORT}`)
    await mongodb()
});