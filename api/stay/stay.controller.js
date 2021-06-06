const stayService = require('./stay.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getStay(req, res) {
    try {
        const stay = await stayService.getById(req.params.id)
        res.send(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(500).send({ err: 'Failed to get stay' })
    }
}

async function getStays(req, res) {

    try {
        const filterBy = {
            city: req.query?.city || '',
            guest: +req.query?.guest || 1,
            type: req.query?.type || '',

            isPets: req.query?.isPets || '',
            isSmoking: req.query?.isSmoking || '',

            minPrice: +req.query?.minPrice || 0,
            maxPrice: +req.query?.maxPrice || 1500,


            tv: req.query?.tv || '',
        }
        const stays = await stayService.query(filterBy)
        res.send(stays)
    } catch (err) {

        logger.error('Failed to get stays', err)
        res.status(500).send({ err: 'Failed to get stays' })
    }
}

async function deleteStay(req, res) {
    try {
        await stayService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete stay', err)
        res.status(500).send({ err: 'Failed to delete stay' })
    }
}

async function addStay(req, res) {
    try {
        const stay = req.body
        const stayToAdd = await stayService.add(stay)
        res.send(stayToAdd)
        // socketService.broadcast({ type: 'stay-added', data: stay, to: stayToAdd._id })
    } catch (err) {
        logger.error('Failed to add stay', err)
        res.status(500).send({ err: 'Failed to add stay' })
    }
}

async function updateStay(req, res) {
    try {
        const stay = req.body
        const savedStay = await stayService.update(stay)
        res.send(savedStay)
        // socketService.broadcast({type: 'stay-updated', data: , to:savedStay._id})
    } catch (err) {
        logger.error('Failed to update stay', err)
        res.status(500).send({ err: 'Failed to update stay' })
    }
}

module.exports = {
    getStays,
    getStay,
    deleteStay,
    updateStay,
    addStay
}