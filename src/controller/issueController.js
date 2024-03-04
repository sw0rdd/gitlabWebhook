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
    const xGitlabEvent = req.headers['x-gitlab-event'];
    console.log('xGitlabEvent', xGitlabEvent)

    if(secretToken !== gitlabToken) {
        return res.status(401).send('Unathorized')
    }

    const eventData = req.body;
    const io = getIo();

    if(xGitlabEvent === 'Issue Hook') {
        io.emit('issue-event', eventData);
        res.status(200).send('webhook received');

    } else if(xGitlabEvent === 'Note Hook') {
        io.emit('comment-event', eventData);
        res.status(200).send('webhook received');

    } else if(xGitlabEvent === 'Push Hook') {
        if (eventData.commits && eventData.commits.length > 0) {
            eventData.commits.forEach(commit => {
                io.emit('commit-event', commit);
            })
        }
        res.status(200).send('webhook received');
    } else {
        res.status(400).send('Unsupported event');
    }

}


const fetchCommentsforIssue = async (projectID, issueIid) => {
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


// just fetch comments for issue id within projekt id 
export const fetchCommentsforIssueId = async (req, res) => {
    try {
        const { issueId } = req.params;
        const comments = await fetchCommentsforIssue(projectID, issueId);

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch comments for the specific issue');
    }
}




// fetches the issues for a project and renders issues 
export const listIssuesWithComments = async (req, res) => {
    try {
        const issues = await fetchIssues();

        // settings some info in res.locals for global template access
        if (issues.length > 0) {
            res.locals.repoUrl = issues[0].web_url.split('/-/')[0];
            res.locals.authorUrl = issues[0].author.web_url;
            res.locals.issuesUrl = issues[0].web_url.split('/-/')[0] + '/-/issues';
        } else {
            res.locals.repoUrl = '';
            res.locals.authorUrl = '';
            res.locals.issuesUrl = '';
        }

        // Date formatting for issues (keep this part)
        issues.forEach(issue => {
            issue.created_at = format(new Date(issue.created_at), 'yyyy-MM-dd HH:mm:ss');
            issue.updated_at = format(new Date(issue.updated_at), 'yyyy-MM-dd HH:mm:ss');
        });

        res.render('issues', { issues });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch issues for the specific repository');
    }
}



