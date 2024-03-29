import express from 'express'

import * as controller from '../controller/commitsController.js'

const router = express.Router()

/**
 * Middleware to check if the user is authenticated.
 * If the user is authenticated, it proceeds to the next middleware.
 * Otherwise, it sends a 403 Forbidden status response.
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {Function} next - next function
 * @returns {Function} - next function
 */
function isAuthenticated (req, res, next) {
  if (req.session.user) {
    return next()
  }
  req.session.orignalUrl = req.originalUrl
  req.flash('error', 'You need to be logged in to access this page')
  res.redirect('users/login')
}

// GET /commits
router.get('/', isAuthenticated, controller.listCommits)

export default router
