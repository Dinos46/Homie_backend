
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(user) {
    try {
        const criteria = _buildCriteria(user)
        const collection = await dbService.getCollection('order')
        return await collection.find().toArray()
        // return the criteria
        // return await collection.find(criteria).toArray()

    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding user ${orderId}`, err)
        throw err
    }
}


async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove user ${orderId}`, err)
        throw err
    }
}

async function update(order) {
    try {
        // peek only updatable fields!
        const orderToSave = {
            ...order,
            _id: ObjectId(order._id),
            status: order.status
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ '_id': orderToSave._id }, { $set: orderToSave })
        return orderToSave;
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function add(order) {
    try {
        // peek only updatable fields!
        const orderToAdd = { ...order }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

function _buildCriteria({ id, type }) {
    // console.log('id', id, 'type', type)
    let criteria = {}
    if (type === 'user') criteria = { 'buyer._id': id }
    else criteria = { 'host._id': id }
    // console.log('criteria', criteria)
    return criteria
}