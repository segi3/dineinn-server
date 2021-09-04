const express = require("express");
const app = express();

const PORT = process.env.PORT_ONE || 3020;

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

mongoose.connect(
    "mongodb://localhost/product-service",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log(`Product-Service DB Connected`);
    }
);

app.use(express.json());

// crud product tmp
const Product = require('./ProductSchema')

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

    // await channel.assertQueue('PRODUCT')
}
amqp_connect()

app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});