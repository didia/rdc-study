// Vendor
import React from 'react';
import {Link} from 'gatsby';
import T from 'prop-types';
import {FormattedMessage} from 'react-intl';

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

          <div className={styles.card__bottom}>
            <FormattedMessage id="shared.price" values={{price: service.price}}>
              {(price) => <p className={styles.card__price}>{price}</p>}
            </FormattedMessage>
            <FormattedMessage id="shared.service-call-to-action">
              {(label) => (
                <Link to={`/accompagnement?service=${service.slug}`} className="button special call-to-action">
                  {label}
                </Link>
              )}
            </FormattedMessage>
          </div>
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
      excerpt: T.string.isRequired
    })
  ).isRequired
};

ServicesPage.propTypes = {
  page: T.object.isRequired,
  services: T.array.isRequired
};
