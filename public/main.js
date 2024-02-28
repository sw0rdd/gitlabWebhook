

document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    socket.on('issue-event', (data) => {
        console.log('Issue event received: ', data)
    })
})