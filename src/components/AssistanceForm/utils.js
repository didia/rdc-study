// styles
import styles from './styles.module.scss';
import axios from 'axios';

export const formikFieldErrorClass = ({touched, error}) => (touched && error ? styles.error : null);

const INTAKE_ENDPOINT = '/api/requests';

/**
 * Stores the request in the admin console (POST /api/requests) AND still sends the legacy email, so a
 * Supabase outage never loses a lead. Success = at least one path worked.
 * Resolves to `{reference}` (when stored) and flags stored-nowhere cases for manual entry.
 */
export const submitAssistanceRequest = async ({endpoint, message, name, email, link, intake}) => {
  const legacy = axios
    .post(endpoint, {message, name, form: 'assistance', email, link})
    .then(() => true)
    .catch((error) => {
      reportError(error, 'legacy_contact_form_failed');
      return false;
    });

  const stored = intake
    ? axios
        .post(INTAKE_ENDPOINT, intake)
        .then((response) => (response.status === 204 ? {disabled: true} : response.data))
        .catch((error) => {
          reportError(error, 'intake_failed');
          return null;
        })
    : Promise.resolve({disabled: true});

  const [legacyOk, storedResult] = await Promise.all([legacy, stored]);
  const isStored = Boolean(storedResult && !storedResult.disabled);

  if (!legacyOk && !isStored) {
    throw new Error('Assistance request could not be sent');
  }
  if (legacyOk && !storedResult) {
    reportMessage('assistance_request_not_stored');
  }
  return {reference: isStored ? storedResult.reference : null};
};

/** "Information" choices are tracked as lightweight requests (best effort, never blocks the visitor). */
export const trackInformationRequest = async (intake) => {
  if (process.env.NEXT_PUBLIC_TRACK_INFORMATION_REQUESTS === 'false' || !intake) return;
  try {
    await axios.post(INTAKE_ENDPOINT, intake);
  } catch (error) {
    reportError(error, 'information_tracking_failed');
  }
};

function reportError(error, tag) {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, {tags: {area: tag}});
  }
}

function reportMessage(tag) {
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage(tag, 'warning');
  }
}
