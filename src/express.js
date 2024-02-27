import express from 'express'
import dotenv from 'dotenv'
import expressLayout from 'express-ejs-layouts'
import logger from 'morgan'
import { WebSocketServer } from 'ws'

import router from './route/router.js'


dotenv.config()

const app = express()



app.use(expressLayout)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(logger('dev'))

app.use(router)

app.get('/', (req, res) => {
    res.render('index')
    })


export default (port = process.env.PORT || 3000) => {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })

    

    // server.on('upgrade', (req, socket, head) => {
    //     WebSocketServer.handleUpgrade(req, socket, head, (ws) => {  
    //         WebSocketServer.emit('connection', ws, req)
    //     })
    // ))

}