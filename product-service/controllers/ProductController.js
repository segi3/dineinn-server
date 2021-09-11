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

    console.log(req.body)

    const products = await Product.find({ _id: { $in: ids } })

    console.log(products)

    console.log(typeof(products))

    channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({
        products,
        userEmail: req.user.email
    })))

    return res.json({ message: 'success-tmp' })
}

// get all products

const getAll = async (req, res) => {

    console.log('fetching all...')

    const products = await Product.find({})

    return res.json(products)
}

// buy from glide apps [tmp] only for a single item

const buyOne = async (req, res) => {
    
    console.log('buying one..')

    const { id, jumlah } = req.body

    if (id == "Sample Value 1") {
        return res.json({ message: 'success-tmp' })
    }

    const product = await Product.find({ _id: id })

    console.log(req.body)

    for (let i=0; i<Number(jumlah)-1; ++i) {
        product.push(product[0])
    }

    console.log(product)

    channel.sendToQueue('ORDER', Buffer.from(JSON.stringify({
        products: product,
        userEmail: req.user.email
    })))

    return res.json({ message: 'success-tmp' })
}

module.exports = {
    create,
    buy,
    buyOne,
    getAll
}