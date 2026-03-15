// Vendor
import axios from 'axios';
import * as Sentry from '@sentry/nextjs';

// Config
import config from '../../config';

const {newsletterEndpoint} = config;

export default async function subscribeToNewsletter({email, firstName, lastName}) {
  const payload = {
    email,
    firstName,
    lastName
  };

  try {
    await axios.post(newsletterEndpoint, payload);
  } catch (error) {
    Sentry.captureException(error);
  }
}
