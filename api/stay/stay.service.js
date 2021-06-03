
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

async function query(filterBy = {}) {
<<<<<<< HEAD
console.log(filterBy)
=======
<<<<<<< HEAD
    console.log('filterBy critiria', filterBy)
=======

>>>>>>> 6e4dfd0d7e556f256fcec3538841452b4a46d3c8
>>>>>>> aabfc237cfd44f942a15cc77d5e23c65e147ff42
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('stay')
<<<<<<< HEAD
        return  await collection.find(criteria).toArray()
=======
<<<<<<< HEAD
        var stays = await collection.find(criteria).toArray()
        stays = stays.map(stay => stay)
=======
        let stays = await collection.find(criteria).toArray()
        console.log('BACK', stays)

        // stays = stays.map(stay => stay)
>>>>>>> 6e4dfd0d7e556f256fcec3538841452b4a46d3c8
        return stays
>>>>>>> aabfc237cfd44f942a15cc77d5e23c65e147ff42
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

async function update(stay) {
    try {
        // peek only updatable fields!
        const stayToSave = {
            _id: ObjectId(stay._id),
            name: stay.name,
            price: +stay.price,
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
<<<<<<< HEAD
    const criteria = {}
    if (!filterBy.city) {
        const txtCriteria = { $regex: filterBy.city, $options: 'i' }
        criteria.$or = [
            {
                name: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
=======
    const { city } = filterBy;
    let criteria = {}
    // if (city) {
    //     criteria.city = { $regex: city, $options: 'i' }
    // }
    if (city) {
        // const txtCriteria = { $regex: city, $options: 'i' }
        criteria = { "loc.city": city }
>>>>>>> aabfc237cfd44f942a15cc77d5e23c65e147ff42
    }
    return criteria
}