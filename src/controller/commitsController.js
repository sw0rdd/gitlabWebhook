import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { format } from 'date-fns'

dotenv.config()

// environment variables
const gitlabToken = process.env.TOKEN
const projectID = process.env.PROJECT_ID

/**
 * express router for the commits endpoint i.e. get commits for a specific project
 * @param {object} req - request object
 * @param {object} res - response object
 */
export const listCommits = async (req, res) => {
  const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/repository/commits`, {
    headers: {
      Authorization: `Bearer ${gitlabToken}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch commits')
  }

  const commits = await response.json()

  commits.forEach(commit => {
    commit.created_at = format(new Date(commit.created_at), 'yyyy-MM-dd HH:mm:ss')
  })

  res.render('commits', { commits })
}
