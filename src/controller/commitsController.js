import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getIo } from '../socket.js'

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

    res.render('commits', { commits });
}

