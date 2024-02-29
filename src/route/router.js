import express from 'express'

const router = express.Router()

import * as controller from '../controller/controller.js'



router.get('/', controller.homePage) // home page 

router.post('/gitlab-webhook', controller.gitlabWebhook) // gitlab webhook

router.get('/issues', controller.listIssuesWithComments) // list specific repository issues

export default router