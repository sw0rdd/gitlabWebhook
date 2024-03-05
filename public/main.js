
/**
 * This file contains the client side code for the application
 * Listen for the DOMContentLoaded event
 */
document.addEventListener('DOMContentLoaded', (event) => {

    // view comments buttons
    const commentButtons = document.querySelectorAll('.view-comments');
    commentButtons.forEach(button => {
        attachCommentButtonListener(button)
    })


    // close and reopen issue buttons
    document.querySelectorAll('.close-issue, .reopen-issue').forEach(button => {
        button.addEventListener('click', function() {
            const issueId = this.getAttribute('data-issue-id');
            if (this.classList.contains('close-issue')) {
                closeIssue(issueId);
            } else if (this.classList.contains('reopen-issue')) {
                reopenIssue(issueId);
            }
        });
    });
    

    const socket = io();


    /**
     * listen for issue events
     * update some parts of the issue if it exists
     * create a new issue if it does not exist
     * @param {object} data - issue data
     */
    socket.on('issue-event', (data) => {
        
        if (data.object_kind === 'issue' && data.object_attributes) {
            console.log(data.object_attributes)


            const isseuElement = document.getElementById(`issue-${data.object_attributes.iid}`)
            if (isseuElement) {
                isseuElement.querySelector('.issue-status').textContent = data.object_attributes.state;

                if (data.object_attributes.state === 'closed') {
                    isseuElement.querySelector('.issue-status').classList.remove('status-opened');
                    isseuElement.querySelector('.issue-status').classList.add('status-closed');
                } else {
                    isseuElement.querySelector('.issue-status').classList.remove('status-closed');
                    isseuElement.querySelector('.issue-status').classList.add('status-open');
                }

                isseuElement.querySelector('.issue-description').textContent = `Description: ${data.object_attributes.description}`
                isseuElement.querySelector('.issue-title').textContent = data.object_attributes.title;
                
                // updated at
                isseuElement.querySelector('.issue-update').textContent = `Last updated at: ${data.object_attributes.updated_at}`

                
                // newly added issue
            } else {
                console.log("new issue added", data.object_attributes.iid)

                const issueElemnt = document.createElement('div');
                issueElemnt.id = `issue-${data.object_attributes.iid}`;
                issueElemnt.classList.add('issue');

                const issueTitle = document.createElement('h2');
                issueTitle.classList.add('issue-title');
                issueTitle.textContent = data.object_attributes.title;

                const issueDescription = document.createElement('p');
                issueDescription.classList.add('issue-description');
                issueDescription.textContent = `Description: ${data.object_attributes.description}`

                const issueStatusSpan = document.createElement('span');
                issueStatusSpan.classList.add('issue-status');
                issueStatusSpan.textContent = data.object_attributes.state;

                if (data.object_attributes.state === 'closed') {
                    issueStatusSpan.classList.add('status-closed');
                } else {
                    issueStatusSpan.classList.add('status-open');
                }

                const issueStatus = document.createElement('p');
                issueStatus.textContent = 'Status: ';
                issueStatus.appendChild(issueStatusSpan);

                const issueAuthor = document.createElement('p');
                issueAuthor.classList.add('issue-author');
                issueAuthor.textContent = `Author: ${data.user.name}`;

                const issueDate = document.createElement('p');
                issueDate.classList.add('issue-date');

                const newDate = new Date(data.object_attributes.created_at);
                const formattedDate = newDate.getFullYear() + '-' +
                ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + newDate.getDate()).slice(-2) + ' ' +
                ('0' + newDate.getHours()).slice(-2) + ':' +
                ('0' + newDate.getMinutes()).slice(-2) + ':' +
                ('0' + newDate.getSeconds()).slice(-2);

                issueDate.textContent = `Created at: ${formattedDate}`


                const updateDate = document.createElement('p');
                updateDate.classList.add('issue-date');

                const newUpdateDate = new Date(data.object_attributes.updated_at);
                const formattedUpdateDate = newUpdateDate.getFullYear() + '-' +
                ('0' + (newUpdateDate.getMonth() + 1)).slice(-2) + '-' +
                ('0' + newUpdateDate.getDate()).slice(-2) + ' ' +
                ('0' + newUpdateDate.getHours()).slice(-2) + ':' +
                ('0' + newUpdateDate.getMinutes()).slice(-2) + ':' +
                ('0' + newUpdateDate.getSeconds()).slice(-2);

                updateDate.textContent = `Last updated at: ${formattedUpdateDate}`

                const newCommentContainer = document.createElement('div');
                newCommentContainer.classList.add('issue-comments');
                newCommentContainer.style.display = 'none';

                const commentsTitle = document.createElement('h3');
                commentsTitle.textContent = 'Comments';
                newCommentContainer.appendChild(commentsTitle);

                const issueLink = document.createElement('a');
                issueLink.href = data.object_attributes.url;
                issueLink.textContent = 'View it on GitLab';
                issueLink.classList.add('issue-button');
                issueLink.classList.add('issue-link');
                issueLink.target = '_blank';

                const viewCommentsButton = document.createElement('button');
                viewCommentsButton.textContent = 'Show comments';
                viewCommentsButton.classList.add('issue-button');
                viewCommentsButton.classList.add('view-comments');
                viewCommentsButton.setAttribute('data-issue-id', data.object_attributes.iid);

                attachCommentButtonListener(viewCommentsButton)

                const closeIssueButton = document.createElement('button');
                closeIssueButton.textContent = 'Close issue';
                closeIssueButton.classList.add('issue-button');
                closeIssueButton.classList.add('close-issue');
                closeIssueButton.setAttribute('data-issue-id', data.object_attributes.iid);

                if (data.object_attributes.state === 'closed') {
                    closeIssueButton.style.display = 'none';
                }

                closeIssueButton.addEventListener('click', function() {
                    closeIssue(this.getAttribute('data-issue-id'))
                })

                const reopenIssueButton = document.createElement('button');
                reopenIssueButton.textContent = 'Reopen issue';
                reopenIssueButton.classList.add('issue-button');
                reopenIssueButton.classList.add('reopen-issue');
                reopenIssueButton.setAttribute('data-issue-id', data.object_attributes.iid);

                if (data.object_attributes.state === 'opened') {
                    reopenIssueButton.style.display = 'none';
                }

                reopenIssueButton.addEventListener('click', function() {
                    reopenIssue(this.getAttribute('data-issue-id'))
                })

                 
                issueElemnt.appendChild(issueTitle);
                issueElemnt.appendChild(issueDescription);
                issueElemnt.appendChild(issueStatus);issueDate
                issueElemnt.appendChild(issueAuthor);
                issueElemnt.appendChild(issueDate);
                issueElemnt.appendChild(updateDate);
                issueElemnt.appendChild(issueLink);
                issueElemnt.appendChild(viewCommentsButton);
                issueElemnt.appendChild(closeIssueButton);
                issueElemnt.appendChild(reopenIssueButton);
                issueElemnt.appendChild(newCommentContainer);

                const issuesList = document.getElementById('issues-list');

                if (issuesList.children[0]) {
                    issuesList.insertBefore(issueElemnt, issuesList.children[0])
                } else {
                    issuesList.appendChild(issueElemnt)
                }
            }
        }
        
    })


    /**
     * Attach a listener to the comment button
     * @param {HTMLElement} button 
     */
    function attachCommentButtonListener(button) {

        button.addEventListener('click', async function() {
            const issueId = this.getAttribute('data-issue-id');
            const commentsContainer = document.getElementById(`issue-${issueId}`).querySelector('.issue-comments')
            const commentsLoaded = commentsContainer.getAttribute('data-comments-loaded');
        
            // only fetching and display comments if they have not been loaded yet
            if (commentsLoaded !== 'true') {
                try {
                    const response = await fetch(`/issues/comments/${issueId}`)
                    const comments = await response.json()
        
        
        
                    // remove exisiting comments if any except the h3 header 
                    while (commentsContainer.children.length > 1) {
                        commentsContainer.removeChild(commentsContainer.lastChild)
                    }
                    
                    // creating and appending comments
        
                    comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment-element');
        
                        const authorP = document.createElement('p');
                        authorP.classList.add('comment-author');
                        authorP.textContent = comment.author.name;
        
                        const bodyP = document.createElement('p');
                        bodyP.classList.add('comment-body');
                        bodyP.textContent = comment.body;
        
                        const createdAtP = document.createElement('p');
                        createdAtP.classList.add('comment-date');
                        createdAtP.textContent = `Created at: ${comment.created_at}`;
        
                        const updatedAtP = document.createElement('p');
                        updatedAtP.classList.add('comment-update');
                        updatedAtP.textContent = `Last updated at: ${comment.updatedAt}`;
        
                        // Append each part to the comment element
                        commentElement.appendChild(authorP);
                        commentElement.appendChild(bodyP);
                        commentElement.appendChild(createdAtP);
                        commentElement.appendChild(updatedAtP);
        
                        // Append the comment element to the comments container
                        commentsContainer.appendChild(commentElement); 
                    })
        
                    // showing the comments when they are loaded
                    commentsContainer.setAttribute('data-comments-loaded', 'true');
                    commentsContainer.style.display = 'block'
        
        
                } catch (error) {
                    console.error('error loading comments', error)
                }
            } else {
                // toggling visibility if already loaded 
                if (commentsContainer.style.display === 'none') {
                    commentsContainer.style.display = 'block'
                } else {
                    commentsContainer.style.display = 'none'
                }
            }
        })
    }


    /**
     * listen for comment events
     * dynamically create and append a new comment to the issue
     * update the last updated date of the issue
     * @param {object} data - comment data, acutally extracted from a push event 
     */
    socket.on('comment-event', (data) => {
        console.log('Comment event received: ', data)

        const issueElement = document.getElementById(`issue-${data.issue.iid}`)

        if (issueElement && issueElement.querySelector('.issue-comments').style.display !== 'none') {

            const commentContainer = issueElement.querySelector('.issue-comments')
    
            const newCommentELement = document.createElement('div');
            newCommentELement.id = `comment-${data.object_attributes.id}`;
            newCommentELement.classList.add('comment-element');
    
            const commentAuthor = document.createElement('p');
            commentAuthor.classList.add('comment-author');
            commentAuthor.textContent = data.user.name;
    
            const commentBody = document.createElement('p');
            commentBody.classList.add('comment-body');
            commentBody.textContent = data.object_attributes.note;
    
            const commentDate = document.createElement('p');
            commentDate.classList.add('comment-date');
    
            const newDate = new Date(data.object_attributes.created_at);
            const formattedDate = newDate.getFullYear() + '-' +
            ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + newDate.getDate()).slice(-2) + ' ' +
            ('0' + newDate.getHours()).slice(-2) + ':' +
            ('0' + newDate.getMinutes()).slice(-2) + ':' +
            ('0' + newDate.getSeconds()).slice(-2);
    
            commentDate.textContent = `Created at: ${formattedDate}`
    
            const updateDate = document.createElement('p');
            updateDate.classList.add('comment-date');
    
            const newUpdateDate = new Date(data.object_attributes.updated_at);
            const formattedUpdateDate = newUpdateDate.getFullYear() + '-' +
            ('0' + (newUpdateDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + newUpdateDate.getDate()).slice(-2) + ' ' +
            ('0' + newUpdateDate.getHours()).slice(-2) + ':' +
            ('0' + newUpdateDate.getMinutes()).slice(-2) + ':' +
            ('0' + newUpdateDate.getSeconds()).slice(-2);
    
            updateDate.textContent = `Last updated at: ${formattedUpdateDate}`
    
            newCommentELement.appendChild(commentAuthor);
            newCommentELement.appendChild(commentBody);
            newCommentELement.appendChild(commentDate);
            newCommentELement.appendChild(updateDate);
    
            if (commentContainer.children[1]) {
                commentContainer.insertBefore(newCommentELement, commentContainer.children[1])
            } else {
                commentContainer.appendChild(newCommentELement)
            }
    
            const issueUpdateDate = issueElement.querySelector('.issue-update');
            issueUpdateDate.textContent = `Last updated at: ${formattedUpdateDate}`
        } else {
            console.log('No issue found for IID:', data.issue.iid);
            return;
        }
    })


    /**
     * listen for commit events
     * dynamically create and append a new commit to the commits list
     * @param {object} data - commit data
     */
    socket.on('commit-event', (data) => {
        const commitsList = document.getElementById('commits-list');

        const commitElement = document.createElement('div');
        commitElement.classList.add('commit');
        commitElement.id = `commit-${data.id}`;

        const commitTitle = document.createElement('h2');
        commitTitle.classList.add('commit-title');
        commitTitle.textContent = data.title;

        const commitMessage = document.createElement('p');
        commitMessage.classList.add('commit-message');
        commitMessage.textContent = `Message: ${data.message}`;

        const commitAuthor = document.createElement('p');
        commitAuthor.classList.add('commit-author');
        commitAuthor.textContent = `Author: ${data.author.name}`;

        const commitDate = document.createElement('p');
        commitDate.classList.add('commit-date');
        
        const newCommitDate = new Date(data.timestamp);
        const formattedDate = newCommitDate.getFullYear() + '-' +
        ('0' + (newCommitDate.getMonth() + 1)).slice(-2) + '-' +
        ('0' + newCommitDate.getDate()).slice(-2) + ' ' +
        ('0' + newCommitDate.getHours()).slice(-2) + ':' +
        ('0' + newCommitDate.getMinutes()).slice(-2) + ':' +
        ('0' + newCommitDate.getSeconds()).slice(-2);
        
        commitDate.textContent = `Created at: ${formattedDate}`;

        const commitLink = document.createElement('a');
        commitLink.href = data.url;
        commitLink.textContent = 'View it on GitLab';
        commitLink.classList.add('commit-link');
        commitLink.target = '_blank';

        commitElement.appendChild(commitTitle);
        commitElement.appendChild(commitMessage);
        commitElement.appendChild(commitAuthor);
        commitElement.appendChild(commitDate);
        commitElement.appendChild(commitLink);

        if (commitsList.children[0]) {
            commitsList.insertBefore(commitElement, commitsList.children[0])
        } else {
            commitsList.appendChild(commitElement)
        }
    })


    /**
     * send a request to the backend to close an issue
     * from the backend a put request is sent to the GitLab API to close the issue
     * @param {string} issueId - issue id
     */
    const closeIssue = async (issueId) => {
        try {
            const response = await fetch(`/issues/close/${issueId}`, {method: 'POST'})
            if (response.ok) {
                document.querySelector(`#issue-${issueId} .close-issue`).style.display = 'none';
                document.querySelector(`#issue-${issueId} .reopen-issue`).style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Failed to close the issue', error);
        }
    }

    /**
     * send a request to the backend to reopen an issue
     * from the backend a put request is sent to the GitLab API to reopen the issue
     * @param {string} issueId - issue id
     */
    const reopenIssue = async (issueId) => {
        try {
            const response = await fetch(`/issues/reopen/${issueId}`, {method: 'POST'})
            if (response.ok) {
                document.querySelector(`#issue-${issueId} .reopen-issue`).style.display = 'none';
                document.querySelector(`#issue-${issueId} .close-issue`).style.display = 'inline-block';
            }
        } catch (error) {
            console.error('Failed to reopen the issue', error);
        }
    }




    
})


