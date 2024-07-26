# Microsoft OAuth2 Service Provider

## Setup / Registration

Here are some notes (hints) related to what you need to do in order
to get the backend running for the Microsoft OAuth2 Service Provider.

### Register the App with Entra

The goal is to register the backend app with the Microsoft OAuth2
Identity Access Management (IAM) Platform so that it can retrieve
the access tokens needed to perform the needed e-mail operations.
This can be done using the [Azure Portal], by following something
like the following steps:

#### Step 1: Create and Register an Application
1. Sign in to the [Azure Portal]:
   - Go to Azure Portal and sign in with your Microsoft account.
     - NOTE: you'll need to create an "Azure" subscription if you don't already have one;
       the "Free Plan" is sufficient for the purposes of registering your new OAuth2 client.
1. Register the Application:
   - In the left-hand navigation pane, select _Identity_ (was: _Azure Active Directory_).
   - Under Manage, select _App Registrations_.
   - Click on _New registration_.
   - Enter the name of your application (e.g., `OAuth2 Email Bridge`).
   - Select from among the Supported account types.  Notes:
     - Choosing _Accounts in any organizational directory (Any Microsoft Entra ID
       tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)_
       could provide the most flexibility.
   - In the _Redirect URI_ section, select the appropriate type (e.g.,
     `Web` or `Public` client) and enter your backend callback URL.  Notes:
     - Selecting `Web` is most relevant since we have a backend whose "callback
       endpoint" is accessible to the front-end.
     - The "Redirect URI" is the URL of the "callback" endpoint on the backend app;
       something like `http://localhost:3000/api/email/oauth-callback`
   - Click _Register_.
#### Step 2: Create OAuth 2.0 Credentials
1. Obtain the _Client ID_ and _Client Secret_ values:
   - After registration, you will be redirected to the application's _Overview_ page.
   - Note the _Application (client) ID_. This is your _client ID_.
   - Under _Manage_, select _Certificates & secrets_.
   - Click on _New client secret_.
   - Add a description and set an expiration period, then click _Add_.
   - Copy the _Value_ of the client secret - this is your _Client Secret_.
     Be sure to copy it immediately as it will not be displayed again.

#### Step 3: Set Up the `.env` File
- Starting by copying the `env-template` file into `.env` in the root of the project,
  then filling in the needed configuration parameters, including the OAuth2
  _Client ID_ and _Client Secret_ values obtained in the previous step.
- Replace the placeholders for the following important properties within the `.env`
  file with your actual credentials or updated values.  Notes:
    - For true "multi-tenant" configurations, you'll also update the `TENANT_ID` value.
    - The value in `MICROSOFT_REDIRECT_URI` should match what you registered
      in the [Azure Portal] (see above).

```env
MICROSOFT_TENANT_ID=common/
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/email/oauth-callback
```

That's it! You've now registered the backend app and newly established credentials
with the Microsoft OAuth2 Service Provider for authorizing email access flows.

## Additional Resources

### Notes

It seems that developer resources are very much in flux over there at Microsoft.
The documentation I've seen makes _many_ references to things that apparently
have new (or go by multiple) names.  For example, what's in some places called
"Active Directory" (and by several other names in older docs) as of this writing
often refers to the new "umbrella" repackaging of the Microsoft AIM offerings
called "Entra".  Tomorrow - _who knows?_

The same is true for SDKs / APIs.  It's hard to know what (set of) SDKs or APIs
is best to use other than to try to spend time getting some chronological sense
of what's newest, and sometimes reflect back on what is more fundamental and what
builds on what, when needed.  From what I can tell, a recent set of libraries known
as `msgraph` might be a good way to go.  That's why I've included a link to the
`msgraph-sample-nodeexpressapp` NodeJS library, below.

### Useful Links

- [OAuth 2.0 and OpenID Connect](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols)
- [Send Outlook messages from another user](https://learn.microsoft.com/en-us/graph/outlook-send-mail-from-other-user)
- [Azure-Samples/ms-identity-node](https://github.com/Azure-Samples/ms-identity-node)
- [msgraph-sample-nodeexpressapp](https://github.com/microsoftgraph/msgraph-sample-nodeexpressapp)
- [microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/README.md)
- [msal-auth.js](https://github.com/OfficeDev/Microsoft-Teams-Samples/blob/main/samples/tab-sso/nodejs/src/client/scripts/msal-auth.js)

[Azure Portal]: https://portal.azure.com