# Backend

## Setup

Notes specific to the Mail Bridge implementations for each Service Provider can
be found in sub-README files:

- [README-Google](./README-Google.md)
- [README-Microsoft](./README-Microsoft.md)

## Testing

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

### Useful Links
- [Aarpn Parecki's oauth-2-simplified](https://aaronparecki.com/oauth-2-simplified)