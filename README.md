# B3 Production

The application in production can be found [here](https://cscloud7-220.lnu.se/)
<br>
Video Presentation can be found [here](https://youtu.be/mn6RPgo0_aQ)


## Description
This application provides a dynamic interface for monitoring and managing issues within a specific GitLab repository. Key features include:

- Listing all issues from the repository along with their authors.
- Displaying commits and their respective authors
- Real-time updates for new issues and comments as they are added
- Live status updates on issues
- Capability to open or close issues directly from the app

While this app allows for opening and closing issues directly, other actions such as commenting or detailed issue management can be performed on GitLab. Changes made on GitLab will reflect in the app in real time, ensuring seamless synchronization.

In this demo you will be able to run the application on localhost


## Instructions and Usage
### Prerequisites
* Node.js (v18.13.0 or later recommended)
* npm (comes with Node.js)
* Mongodb

### Clone the repo 

```
git clone git@gitlab.lnu.se:1dv528/student/sy222ea/b3-production.git
cd b3-production
```
<br>

## Setup GitLab Access Token and Webhook 
To use this application with your GitLab repository, you must configure an access token and a webhook. This allows the application to fetch issues and receive real-time updates when issues are created or updated.

### GitLab Access Token
1. Generate a Personal Access Token in GitLab:
    * Go to your GitLab account settings.
    * Find the Access Tokens section under API.
    * Create a new token with api scope to allow the application to access your GitLab data.
    * Make sure to copy the token immediately, as you won't be able to see it again.


### GitLab Webhook
For the application to receive real-time events from GitLab, you need to set up a webhook in your GitLab repository.

1. Create a Webhook in Your GitLab Repository:

    * Find detailed instructions on setting up a webhook in the [GitLab Webhook Documentation](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html)
    * Navigate to your repository settings in GitLab, go to "Webhooks", and create a new webhook.
2. Setting the Webhook URL:

    * Webhooks require a publicly accessible URL to send data to your application. If you are running your application locally (e.g., on localhost), it will not be accessible from the internet by default.
    * To work around this, you can use a service like ngrok which allows you to create a secure tunnel to your localhost server. This makes your local server accessible from the internet with a public URL.


#### To use ngrok

* Download and install ngrok from [ngrok's website](https://ngrok.com/).
* Start ngrok with the command ```ngrok http PORT``` where PORT is the port your local server is running on.
* Copy the ngrok URL it provides and use that as your Webhook URL in GitLab's webhook setup.

1. Enter the Webhook URL in GitLab:
    * After setting up ngrok, use the ngrok URL followed by ```/gitlab-webhook``` For example: ```https://your-ngrok-url.ngrok.io/gitlab-webhook```
    * Choose the events (push events on all branches, comments and issue events)
    * Save the webhook to finalize the setup.


<br>

## Configure Environment Variables <br>

Copy the .env.example file to a new file named .env and fill in your MongoDB URI, port, GitLab access token and your project id. 


```
cp .env.example .env
```
<br>

## Running locally 
Install Dependencies<br>
Install the necessary npm packages:
```
npm install
```

Start the application using npm:

```
npm start 
```