const express = require('express')
const productController = require('../controllers/ProductController')
const isAuthenticated = require('../../utils/middleware/isAuthenticated')

const router = express.Router()

router.post('/create', isAuthenticated, productController.create)
router.post('/buy', isAuthenticated, productController.buy)
router.post('/buy/one', isAuthenticated, productController.buyOne)
router.post('/get', productController.getAll)

module.exports = router