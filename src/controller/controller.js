import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getIo } from '../socket.js'
import { format } from 'date-fns'

dotenv.config()

const gitlabToken = process.env.TOKEN
const projectID = process.env.PROJECT_ID



export const gitlabWebhook = (req, res) => {
    const secretToken = req.headers['x-gitlab-token'];

    if(secretToken !== gitlabToken) {
        return res.status(401).send('Unathorized')
    }

    const eventData = req.body;
    console.log(eventData)
    const io = getIo();

    if (eventData.object_kind === 'issue') {
        io.emit('issue-event', eventData)
        res.status(200).send('webhook received');

    } else if (eventData.object_kind === 'note') {
        io.emit('comment-event', eventData)
        res.status(200).send('webhook received');
    }
}


const fetchCommentforIssue = async (projectID, issueIid) => {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/issues/${issueIid}/notes`, {
        headers: {
            'Authorization': `Bearer ${gitlabToken}`
        }
    });

    if (!response.ok) { 
        throw new Error('Failed to fetch comments for the specific issue');
    }

    const notes = await response.json();
    
    const userNote = notes.filter(note => note.system === false).map(note => {
        return {
            ...note,
            created_at: format(new Date(note.created_at), 'yyyy-MM-dd HH:mm:ss'),
            updatedAt: format(new Date(note.updated_at), 'yyyy-MM-dd HH:mm:ss')
        }
    });

    return userNote;
}



const fetchIssues = async () => {
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

export const listIssuesWithComments = async (req, res) => {
    try {
        const issues = await fetchIssues();

        for (const issue of issues) {
            issue.comments = await fetchCommentforIssue(issue.project_id, issue.iid)

            // date formatting
            issue.created_at = format(new Date(issue.created_at), 'yyyy-MM-dd HH:mm:ss')
            issue.updated_at = format(new Date(issue.updated_at), 'yyyy-MM-dd HH:mm:ss')
        }
        res.render('issues', { issues })



    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch issues for the specific repository');
    }
}



