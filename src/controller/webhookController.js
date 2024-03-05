
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { getIo } from '../socket.js'


dotenv.config()

const gitlabToken = process.env.TOKEN

/**
 * This function is responsible for handling the webhook events from Gitlab.
 * @param {object} req - request object
 * @param {object} res - response object 
 * @returns {object} - response object
 */
export const handleHook = (req, res) => {
    const secretToken = req.headers['x-gitlab-token'];
    const xGitlabEvent = req.headers['x-gitlab-event'];

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

export default handleHook