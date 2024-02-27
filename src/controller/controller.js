import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const gitlabToken = process.env.TOKEN
const groupID = process.env.GROUP_ID



export const gitlabWebhook = (req, res) => {
    // TODO: Implement this
    res.status(200).send('Webhook received')
}


const fetchRepositories = async (groupID) => {
    console.log(groupID)
    console.log(gitlabToken)
    const response = await fetch(`https://gitlab.lnu.se/api/v4/groups/${groupID}/projects`, {
    headers: {
        'Authorization': `Bearer ${gitlabToken}`
    }
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch repositories')
    }

    return await response.json()
    
}


const fetchIssuesForRepository = async (projectID) => {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues`, {
    headers: {
        'Authorization': `Bearer ${gitlabToken}`
    }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch repositories')
    }

    return await response.json()

}



export const listRepositories = async (req, res) => {
    try {
        const repositories = await fetchRepositories(groupID);
        // Render a view called 'repositories.ejs' and pass the repositories data
        res.render('repositories', { repositories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch repositories');
    }
};

export const listRepositoryIssues = async (req, res) => {
    try {
        const { repoId } = req.params; // Get the repository ID from the URL parameter
        const issues = await fetchIssuesForRepository(repoId);
        // Render a view called 'issues.ejs' and pass the issues data
        res.render('issues', { issues });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Failed to fetch issues for repository ${req.params.repoId}`);
    }
};
