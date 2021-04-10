// Vendor
import React from 'react';
import {Link} from 'gatsby';
import T from 'prop-types';

// Styles
import styles from './styles.module.scss';

// Components
import GenericPage from '../GenericPage';
import Card from '../../Card';

const ServiceList = ({services}) => (
  <ul className={styles.list}>
    {services.map((service, i) => (
      <li key={i}>
        <Card className={styles.card}>
          <h2 className={styles.card__title}>{service.title}</h2>
          <p className={styles.card__description}>{service.excerpt}</p>
          <p className={styles.card__price}>{service.price}</p>
          <Link to="/accompagnement" className="button special call-to-action">
            Je veux ce service
          </Link>
        </Card>
      </li>
    ))}
  </ul>
);

const ServicesPage = ({page, services}) => (
  <GenericPage page={page}>
    <ServiceList services={services} />
  </GenericPage>
);

export default ServicesPage;

ServiceList.propTypes = {
  services: T.arrayOf(
    T.shape({
      slug: T.string.isRequired,
      title: T.string.isRequired,
      price: T.number.isRequired,
      excerpt: T.string.isRequired,
      callToActionLabel: T.string.isRequired
    })
  ).isRequired
}

ServicesPage.propTypes = {
  page: T.object.isRequired,
  services: T.array.isRequired
};
