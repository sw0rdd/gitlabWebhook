import express from 'express'

const router = express.Router()

import * as controller from '../controller/controller.js'



router.post('/gitlab-webhook', controller.gitlabWebhook) // gitlab webhook

router.get('/issues', controller.listSpecificRepositoryIssues) // list specific repository issues

export default router