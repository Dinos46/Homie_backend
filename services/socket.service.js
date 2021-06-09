const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

var gIo = null
var gSocketBySessionIdMap = {}
var gSocketByUserIdMap = {}


function connectSockets(http, session) {
    gIo = require('socket.io')(http)

    const sharedSession = require('express-socket.io-session')

    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        // if (socket.handshake?.session?.user) socket.join(socket.handshake.session.user._id)
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('LOGIN', (user) => {
    
            gSocketByUserIdMap[user._id] = socket
        })
        // This is what we send after reserving a stay:
        socket.on('ORDER_OUT', ({ hostId, stay }) => {
            const hostSocket = gSocketByUserIdMap[hostId]

            // This is what the host will get:
            if (hostSocket) {
                hostSocket.emit('ORDER_IN', stay.host.fullname)
                hostSocket.emit('USER_MSG', 5)
            }

        })

        socket.on('ORDER_STATUS', (order)=>{
            const buyerSocket = gSocketByUserIdMap[order.buyer._id]
            if(buyerSocket) buyerSocket.emit('STATUS_FROM_HOST', order.status)
        })
    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast,
}