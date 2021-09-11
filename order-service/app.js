const express = require("express")
const app = express()

const PORT = process.env.PORT_ONE || 3030

const jwt = require("jsonwebtoken")

const mongoose = require('mongoose')
const MONGOPATH = process.env.MONGOPATH || 'mongodb://localhost/dineinn'

const mongodb = async() => {
    await mongoose.connect(MONGOPATH, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err)=> {
        if (err) console.log(err)
        console.log(`Order service db connected`)
    })
    
    return mongoose
}

app.use(express.json())

// crud product tmp
const Order = require('./OrderSchema')
const isAuthenticated = require('../utils/middleware/isAuthenticated')

const createOrder = (products, userEmail) => {
    let total = 0

    for (let i=0; i<products.length; i++) {
        total += products[i].price
    }

    console.log(products)

    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total
    })
    newOrder.save()

    return newOrder
}

// rabbit mq
// docker run -p 5672:5672 -p 15672:15672 rabbitmq:management
var channel, amqpConnection

const amqp = require('amqplib')
const amqp_connect = async () => {

    const amqpServer = 'amqp://localhost:5672'

    amqpConnection = await amqp.connect(amqpServer)
    console.log('connected')

    channel = await amqpConnection.createChannel()
    console.log('create channel')

    await channel.assertQueue('ORDER')
}

// TODO: add RPC
amqp_connect().then( () => {
    channel.consume('ORDER', (data) => {
        const { products, userEmail } = JSON.parse(data.content)
        console.log('consuming ORDER queue')
        console.log(products)

        const newOrder = createOrder(products, userEmail)

        channel.ack(data)
    })
})

// tmp
const Product = require('./models/ProductSchema')

app.post('/order/getAll', isAuthenticated, async (req, res) => {

    const orders = await Order.find({ user: req.user.email })

    var resmes = []

    // console.log(orders[0].products[0]._id.toString())

    for (let i = 0; i<orders.length; i++) {
        let oneProduct = await Product.find({ _id: orders[i].products[0]._id })
        // console.log(oneProduct)
        resmes.push({
            user: req.user,
            order: orders[i],
            product: oneProduct[0]
        })
    }

    return res.json(resmes)
})

app.listen(PORT, async () => {
    console.log(`Order-Service at ${PORT}`)
    await mongodb()
})