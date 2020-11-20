// Vendor
import axios from 'axios';

// Utils
import analyticsPushEvent from '../utils/push-analytics-event';

// Config
import config from '../../config';

const {newsletterEndpoint} = config;

export default async function subscribeToNewsletter({email, firstName, lastName, analyticsLabel}) {
  const payload = {
    email,
    firstName,
    lastName
  };

  try {
    await axios.post(newsletterEndpoint, payload);

    analyticsPushEvent({
      category: 'Newsletter',
      action: 'SubscribeSuccess',
      label: analyticsLabel || window.location.pathname
    });
  } catch (error) {
    if (!window.Sentry) {
      return;
    }

    window.Sentry.captureException(error);
  }
}
