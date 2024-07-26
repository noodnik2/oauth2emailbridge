# Google OAuth2 Service Provider

## Setup / Registration

Here are some notes (hints) related to what you need to do in order
to get the backend running for the Google OAuth2 Service Provider.

### Register the App with Google Cloud

The goal is to register the backend app with Google so that it can
retrieve access tokens needed to perform the needed e-mail operations.
This can be done from the [Google Cloud Console].

To register with Google and obtain the necessary credentials for your
`.env` file, follow these steps:

#### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console]
1. Create a new project:
   - Click on the project dropdown at the top.
   - Click on "New Project".
   - Enter a project name and click "Create".
#### Step 2: Enable APIs
1. Select the project: From the dropdown, select the project you just created.
1. Enable the Gmail API:
   - Go to the _Gmail API Library_.
   - Click on "Enable".
#### Step 3: Create OAuth 2.0 Credentials
1. Go to the Credentials page: _Credentials_
1. Create OAuth 2.0 Client ID:
    - Click on "Create Credentials".
   - Select "OAuth 2.0 Client IDs".
   - Configure the consent screen (also can "Edit" this section later):
     - Enter the required information (e.g., application name, support email).
     - Click "Save and Continue", add the "Scope" values - e.g.: 
         - This was unclear to me, so I just added everything
           - _**TODO**: research this & cut the list to the minimum privileges needed!_
           - See / reconfigure the _scope_ values initially hard-coded; e.g.:
               - `https://mail.google.com/`
               - `https://www.googleapis.com/auth/gmail.send`
     - Click "Save and Continue", add your "Test Users" - e.g.: e-mail accounts you wish to
       on whose behalf you wish to test access using OAuth2 authorizations. 
     - Once you're done setting up the "Consent Screen" configuration, click "Back to Dashboard".
   - Configure OAuth 2.0 Client ID:
       - Select "Web application".
     - Enter a name for the OAuth 2.0 client.
     - Add "Authorized redirect URIs" (e.g., http://localhost:3000/api/email/oauth-callback).
     - Click "Create".
1. Copy the credentials:
   - After creation, a dialog with your Client ID and Client Secret will appear.
   - Copy these values for use into your `.env` file.
#### Step 4: Setup a Local Tunnel Service

In order to finish registering your OAuth2 client with the Google Cloud Console, you'll need to
provide an "Authorized redirect URI".  It didn't accept something like `http://localhost:3000`
(i.e., my local backend), likely (at least) since it didn't support HTTPS. 

You can use a service like `ngrok` to create a temporary public URL that supports HTTPS and
tunnels to your local development server.

1. Install `ngrok`:
   - Download and install `ngrok` from [ngrok.com](https://ngrok.com).
1. Start ngrok:
   - Run `ngrok` to tunnel your local server port (e.g., `3000`):
     - `$ ngrok config add-authtoken _____`
     - `$ ngrok http http://localhost:3000`
1. Get the `ngrok` URL:
   - `ngrok` will provide a public URL (e.g., https://abcd1234.ngrok.io).
1. Enter the `ngrok` URL in Google Cloud Console:
   - In the OAuth2 consent screen configuration, add the ngrok URL (e.g., abcd1234.ngrok.io)
     to the "Authorized domains".
   - When creating your OAuth 2.0 Client ID, use the ngrok URL as the redirect URI
     (e.g., https://abcd1234.ngrok.io/api/email/oauth-callback).

#### Step 5: Set Up the `.env` File
   - Starting by copying the `env-template` file into `.env` in the root of the project,
     then filling in the needed configuration parameters, including the OAuth service IDs
     and secret values.
   - Replace the placeholders for the following important properties within the `.env`
     file with your actual credentials:

```env
GOOGLE_CLIENT_EMAIL=your_google_client_email@whatever.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your_oauth2_backend_url_prefix/api/email/oauth-callback
```

Assuming you used `ngrok` to create and register your backend with your OAuth2 client, this will
look something like this:

```env
GOOGLE_CLIENT_EMAIL=your_google_client_email
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://g826-26-237-26-15.ngrok-free.app/api/email/oauth-callback
PORT=3000
SEQUENCE_LOG_FILE=logs/sequence.log
```

## Additional Resources

### Useful Links
- [Google APIs Node.js Client](https://googleapis.dev/nodejs/googleapis/latest/people/index.html)
- [google-cloud-node](https://github.com/googleapis/google-cloud-node)
- [google-api-nodejs-client](https://github.com/googleapis/google-api-nodejs-client)

[Google Cloud Console]: https://console.cloud.google.com/