import express from 'express'

const router = express.Router()

import * as controller from '../controller/controller.js'


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
    res.status(403).send('You are not authorized to access this page FORBIDDEN')
}


router.get('/', isAuthenticated  ,controller.listIssuesWithComments) // list specific repository issues

router.post('/gitlab-webhook', controller.gitlabWebhook) // gitlab webhook


export default router