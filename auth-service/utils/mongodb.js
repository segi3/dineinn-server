const mongoose = require('mongoose')

const MONGOPATH = process.env.MONGOPATH || 'mongodb://localhost/dineinn-auth'

module.exports = async() => {
    await mongoose.connect(MONGOPATH, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err)=> {
        if (err) console.log(err)
        console.log(`Auth service db connected`)
    })
    
    return mongoose
}