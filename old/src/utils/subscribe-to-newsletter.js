// Vendor
import axios from 'axios';

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
    if (!window.Sentry) {
      return;
    }

    window.Sentry.captureException(error);
  }
}
