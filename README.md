# rdc-study project

This the repository for the rdc-study project.

## Running

Make sure that you have the Gatsby CLI program installed:

```sh
npm install --global gatsby-cli
```

Then you can run it by:

```sh
nv .env npm run develop
```

## Environment Variables

We use `nv` to inject our environment variables when running locally.
All environment variables prefixed by `GATSBY_` will be exposed to the browser.

```
GATSBY_CONTACT_FORM_ENDPOINT=The endpoint to send contact information #required
SENTRY_DSN=The DSN for Sentry #required in production
```
