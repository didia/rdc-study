# rdc-study project

This the repository for the rdc-study project.

## Running

Make sure that you have the Gatsby CLI program installed:

```sh
npm install --global gatsby-cli
```

Then you can run it by:

```sh
npm start
```

## Producing background images

For background images, our styling structure right now does not allow us to use `gatsby-images`. So what we do is we run the image through the graphql query and copy the image produced to use it as background.

## Environment Variables

We use `nv` to inject our environment variables when running locally.
All environment variables prefixed by `GATSBY_` will be exposed to the browser.

```
AWS_BUCKET_NAME=The AWS Bucket name where the app is deployed #required for deploiement
CLOUDFRONT_ID=The cloud front id for the app #required for deploiement
GATSBY_GOOGLE_AD_CLIENT=The Google Ad Client #required
GATSBY_CONTACT_FORM_ENDPOINT=The endpoint to send contact information #required
GOOGLE_TAG_MANAGER_ID=The Google Tag Manager Id #require in production
GATSBY_SENTRY_DSN=The DSN for Sentry #required in production
SURGE_DOMAIN=The domain name for the surge app
```

### Feature flags

Sections that are built but waiting for real content are hidden by default. Set the variable to `true` to show them:

```
NEXT_PUBLIC_FEATURE_TESTIMONIALS=true     # Testimonials + "what AI assistants say" (home, services). Content: `site.testimonials.*` in src/locales/fr.json
NEXT_PUBLIC_FEATURE_FEATURED_GUIDE=true   # Featured step-by-step guide on /guides. Content: `site.guides.featured.*` in src/locales/fr.json
```

To show a photo for testimonial N, add `"site.testimonials.items.N.photo": "/images/uploads/<file>.jpg"` to fr.json.
