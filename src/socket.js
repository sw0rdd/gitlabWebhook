/**
 * This file is responsible for initializing the socket.io server and exporting the instance of the server.
 */

import {Server} from 'socket.io'

let io;

/**
 * 
 * @param {Server} server 
 * @returns {Server}
 */
export const initIo = (server) => {
    io = new Server(server)

    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })

    return io
}


/**
 * function to get the instance of the socket.io server 
 * @returns {Server}
 */
export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!')
    }

    return io
}