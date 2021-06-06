const express = require('express')
const { getOrders, getOrder, deleteOrder, updateOrder, addOrder } = require('./order.controller')
const router = express.Router()

router.get('/', getOrders)
router.get('/:id', getOrder)
router.post('/', addOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

module.exports = router