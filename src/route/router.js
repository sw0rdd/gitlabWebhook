import express from 'express'

const router = express.Router()

import * as controller from '../controller/controller.js'



router.post('/gitlab-webhook', controller.gitlabWebhook) // gitlab webhook

router.get('/repos', controller.listRepositories) // fetch data from api)

router.get('/repos/:repoId/issues', controller.listRepositoryIssues) // fetch issues for a specific repository

export default router