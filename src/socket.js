import {Server} from 'socket.io'

let io;

export const initIo = (server) => {
    io = new Server(server)

    io.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('disconnect', () => {
            console.log('user disconnected')
        })
    })

    // I can add more event here

    return io
}



export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!')
    }

    return io
}