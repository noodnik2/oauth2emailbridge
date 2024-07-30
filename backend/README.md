# Backend

A backend application built atop [Express.js](https://expressjs.com/) that
interacts with OAuth2 Token Authorities (such as provided by Google or
Microsoft) on behalf of a user for retrieving access tokens needed to provide
delegated access to protected resources controlled by those authorities.

## Setup

Notes about setting up & registering your OAuth2 token providers, and
about the OAuth2 Email Bridge implementations specific to each Service Provider
can be found in sub-README files:

- [README-Google](./README-Google.md)
- [README-Microsoft](./README-Microsoft.md)


## Running & Testing

Once you've set the needed configuration values in the `.env` file for each
Service Provider you wish to use (see _Setup_ above), you can focus on starting
the backend application.

A normal procedure for installing the `npm` dependencies should be done first,
as illustrated in the console excerpt below.

- _NOTE: the versions of `npm` and `node` are highlighted only for context
  about the depicted working console session:_

```shell
$ npm -version
9.8.0
$ node --version
v18.15.0
$ rm -rf dist node_modules/
$ npm install
...
added 215 packages, and audited 216 packages in 3s
...
found 0 vulnerabilities
```

After setting up the backend for the Service Provider(s) you wish to use,
you can run the backend application using the standard `npm` commands, e.g.:

```shell
$ npm run dev
```

Once running, you can test its responses from its endpoints (see `emailRoutes.ts`) using
Postman, `curl` or other HTTP testing tool.

As of this writing, there are some basic test directives appearing in the `testing.http` file.
Variables supporting several test environments are encoded into the `http-client.private.env.json`
file, for use with IntelliJ's "HTTP Plugin".

### Sequence Diagrams

If the `SEQUENCE_LOG_FILE` configuration parameter (see above) is set, a "sequence diagram"
log will be written that roughly describes the entire OAuth2 interaction.  This log will be
reset at the start of each invocation of the backend server, and will accumulate the entire
sequence encountered between the end-user (i.e., the frontend application) and the Service
Provider.

Copying the contents of this file into the web sequence diagram renderer available at the
URL [www.websequencediagrams.com](https://www.websequencediagrams.com/app) can be a useful
way to help understand what is happening, and how the OAuth2 interaction is carried out.

## Additional Resources

### Wishlist

A yet-to-be implemented - but identified as desired by this PoC - "Centralized" OAuth2
token provider is described in [README-Centralized](./README-Centralized.md).

### Useful Links
- [Aarpn Parecki's oauth-2-simplified](https://aaronparecki.com/oauth-2-simplified)