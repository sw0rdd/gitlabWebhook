import express from 'express'

import * as userController from '../controller/userController.js'

const userRouter = express.Router()

// Display form to register
userRouter.get('/register', userController.registerForm)

// register post
userRouter.post('/register', userController.handleRegister)

// Display form to login
userRouter.get('/login', userController.loginForm)

// Login
userRouter.post('/login', userController.handleLogin)

// Logout
userRouter.get('/logout', userController.logout)

export default userRouter
