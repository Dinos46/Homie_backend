const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    addReview
}

async function query(filterBy = {}) {

    const criteria = _buildCriteria(filterBy)

    try {
        const collection = await dbService.getCollection('stay')
        return await collection.find(criteria).toArray()
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding user ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
    } catch (err) {
        logger.error(`cannot remove user ${stayId}`, err)
        throw err
    }
}

async function addReview(id, review) {
    try {
        console.log('BACKSERV', id, review)
    } catch (err) {
        console.log('cant add review', err)
    }
}

async function update(stay) {
    try {
        // peek only updatable fields!
        const stayToSave = {
            _id: ObjectId(stay._id),
            reviews: stay.reviews
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ '_id': stayToSave._id }, { $set: stayToSave })
        return stayToSave;
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        // peek only updatable fields!
        const stayToAdd = { ...stay }
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stayToAdd)
        return stayToAdd
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    let criteria = {}
    const {
        city,

        type,
        minPrice,
        maxPrice,

        tv,
        wifi,
        kitchen,
        accessibility,
        airConditioner,
        secured,
        fastFood,
        parking,
        aidKit,
        publicTransport,
    } = filterBy;

    if (city) {
        const txtCriteria = { $regex: city, $options: 'i' }
        criteria = { ...criteria, "loc.city": txtCriteria }
    }
    if (type) {
        const typeCriteria = { $regex: type, $options: 'i' }
        criteria = { ...criteria, "type": typeCriteria }
    }
    if (maxPrice) {
        const minimumPrice = +minPrice
        const maximumPrice = +maxPrice
        criteria = { ...criteria, "price": { $gte: minimumPrice, $lte: maximumPrice } }
    }
    if (tv) criteria = { ...criteria, "amenities.tv": true }
    if (wifi) criteria = { ...criteria, "amenities.wifi": true }
    if (kitchen) criteria = { ...criteria, "amenities.kitchen": true }
    if (accessibility) criteria = { ...criteria, "amenities.accessibility": true }
    if (airConditioner) criteria = { ...criteria, "amenities.airConditioner": true }
    if (secured) criteria = { ...criteria, "amenities.secured": true }
    if (fastFood) criteria = { ...criteria, "amenities.fastFood": true }
    if (parking) criteria = { ...criteria, "amenities.parking": true }
    if (aidKit) criteria = { ...criteria, "amenities.aidKit": true }
    if (publicTransport) criteria = { ...criteria, "amenities.publicTransport": true }
    return criteria
}