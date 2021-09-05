const Product = require('./../models/ProductSchema')

var channel, amqpConnection

// TODO: add RPC
const amqp = require('amqplib')
const amqp_connect = async () => {

    const amqpServer = 'amqp://localhost:5672'

    amqpConnection = await amqp.connect(amqpServer)
    console.log('connected')

    channel = await amqpConnection.createChannel()
    console.log('create channel')

    await channel.assertQueue('PRODUCT')
}
amqp_connect()

// create new product
const create = async (req, res) => {
    const { name, description, price } = req.body

    const newProduct = new Product({
        name,
        description,
        price
    })
    newProduct.save()

    return res.json(newProduct)
}

// buy products

const buy = async (req, res) => {

    const { ids } = req.body
    const products = await Product.find({ _id: { $in: ids } })

    channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({
        products,
        userEmail: req.user.email
    })))

    return res.json({ message: 'success-tmp' })
}

module.exports = {
    create,
    buy
}