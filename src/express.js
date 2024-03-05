/**
 * This file is responsible for setting up the express server
 * and setting up the routes, middlewares, session, and socket.io
 * in addition to connecting to the database
 */

import express from 'express'
import dotenv from 'dotenv'
import expressLayout from 'express-ejs-layouts'
import logger from 'morgan'
import { createServer } from 'http'
import { initIo } from './socket.js'
import flash from 'connect-flash'
import session from 'express-session'
import mongoose from 'mongoose'

import userRouter from './route/userRoute.js'
import issuerouter from './route/issueRoute.js'
import commitsRouter from './route/commitsRoute.js'
import handleHook from './controller/webhookController.js'

dotenv.config()

const app = express()

app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => {
  console.log(err)
})

app.use(session({
  cookie: {
    maxAge: 86400000,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  secret: 'cat cat'
}))

app.use(flash())

// middle ware to set some values
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  res.locals.user = req.session.user

  res.locals.repoUrl = ''
  res.locals.authorUrl = ''
  res.locals.issuesUrl = ''
  next()
})

app.use(logger('dev'))
app.use(express.static('public'))
app.use(express.json())
app.use(expressLayout)
app.set('layout', 'layouts/layout')
app.use(express.urlencoded({ extended: true }))

app.use('/issues', issuerouter)
app.use('/users', userRouter)
app.use('/commits', commitsRouter)

app.get('/', (req, res) => {
  res.render('index')
})

// Webhook route
app.post('/gitlab-webhook', handleHook)

export default (port = process.env.PORT || 5050) => {
  const httpServer = createServer(app)
  initIo(httpServer)

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
