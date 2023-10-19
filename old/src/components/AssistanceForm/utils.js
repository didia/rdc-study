// styles
import styles from './styles.module.scss';

export const formikFieldErrorClass = ({touched, error}) => (touched && error ? styles.error : null);
