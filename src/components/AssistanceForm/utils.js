// styles
import styles from './styles.module.scss';
import axios from 'axios';

export const formikFieldErrorClass = ({touched, error}) => (touched && error ? styles.error : null);

export const submitAssistanceRequest = async ({endpoint, message, name, email, link}) => {
  await axios.post(endpoint, {
    message,
    name,
    form: 'assistance',
    email,
    link
  });
};
