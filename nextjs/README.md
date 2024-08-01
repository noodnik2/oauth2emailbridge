# [Next.js]

Following the ideation about leveraging a
[centralized OAuth2 Token Authority](../backend/README-Centralized.md) led me to
try out a [sample Auth0 web app](https://github.com/auth0-developer-hub/web-app_nextjs_typescript_hello-world)
using [Next.js].  I found the [related developer guide](https://developer.auth0.com/resources/guides/web-app/nextjs/basic-authentication)
extremely easy to follow, learned a lot from it, and came out thinking of this as
a much better "starting point" for learning about & building (at least) a PoC as
called for in this repo.

As of this initial check-in, there's no use of the underlying APIs (e.g., for
accessing Gmail or Outlook mail), but that detail seems insignificant given I've 
already demonstrated that in the existing [backend](../backend/README.md) and
[frontend](../frontend/README.md) components of this repo.  Maybe I (or someone
else?) will take the time to add that functionality to this folder?

The customized example [Next.js] webapp is located in the sub-folder:

- [auth0poc](./auth0poc/README.md)

[Next.js]: https://nextjs.org/