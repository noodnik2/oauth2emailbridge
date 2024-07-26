# Frontend React App

This `OAuth2 Email Bridge` frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app); 
accordingly, it can be managed using the relevant tooling and related infrastructure.

## Setup

You'll need to let the frontend know how to reach the backend.  To do this, configure its URL
prefix into the configuration variable `REACT_APP_BACKEND_URL_PREFIX` in the correct version
of the `.env` file (i.e., for React, this could be `.env.local`, `.env.development.local` 
or `.env.production.local`, etc.).  You can start with a fresh version of these files by
copying the `env-template` into (for example) `.env.local` before starting.  Notes:
- The default values _may just work_; if not, you can update the nonstandard values
  in the `.env.local` (or whatever version of this) local copy of this template file.
- See [Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
  for more information about configuring React apps.

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
added 1532 packages, and audited 1533 packages in 10s
...
found 0 vulnerabilities
```

## Available Scripts

After installing all of the dependencies (see _Setup_ above), in the project directory,
you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
