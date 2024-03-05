import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { format } from 'date-fns'


dotenv.config()

const gitlabToken = process.env.TOKEN
const projectID = process.env.PROJECT_ID


export const listCommits = async (req, res) => {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/projects/${projectID}/repository/commits`, {
        headers: {
            'Authorization': `Bearer ${gitlabToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch commits');
    }

    const commits = await response.json();

    commits.forEach(commit => {
        commit.created_at = format(new Date(commit.created_at), 'yyyy-MM-dd HH:mm:ss');
    });

    res.render('commits', { commits });
}

