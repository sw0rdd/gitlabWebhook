import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getIo } from '../socket.js'

dotenv.config()

const gitlabToken = process.env.TOKEN
const groupID = process.env.GROUP_ID
const projectID = process.env.PROJECT_ID



export const gitlabWebhook = (req, res) => {
    const secretToken = req.headers['x-gitlab-token'];

    if(secretToken !== process.env.TOKEN) {
        return res.status(401).send('Unathorized')
    }

    const eventData = req.body;
    console.log(eventData);

    const io = getIo();
    io.emit('issue-event', eventData)
    res.status(200).send('webhook received');
}




const fetchIssuesForSpecificRepository = async () => {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues`, {
        headers: {
            'Authorization': `Bearer ${gitlabToken}`
        }
    });

    if (!response.ok) { 
        throw new Error('Failed to fetch issues for the specific repository');
    } 

    return await response.json();
};

export const listSpecificRepositoryIssues = async (req, res) => {
    try {
        const issues = await fetchIssuesForSpecificRepository();
        res.render('issues', { issues });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch issues for the specific repository');
    }
}