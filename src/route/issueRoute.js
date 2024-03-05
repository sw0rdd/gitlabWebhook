import express from 'express'

const router = express.Router()

import * as controller from '../controller/issueController.js'


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
    req.session.orignalUrl = req.originalUrl;
    req.flash('error', 'You need to be logged in to access this page')
    res.redirect('users/login')
}

// GET /issues
router.get('/', isAuthenticated  ,controller.listIssues)

// get comments for a specific issue (request from the client)
router.get('/comments/:issueId', isAuthenticated, controller.fetchCommentsforIssueId) 

// close a specific issue
router.post('/close/:issueId', isAuthenticated, controller.closeIssue)

// open a specific issue
router.post('/reopen/:issueId', isAuthenticated, controller.reopenIssue)

export default router