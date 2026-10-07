'use client';

import React from 'react';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import ui from './ui.module.scss';

const ServiceCard = ({title, text, price, image, href}) => {
  const intl = useIntl();

  return (
    <div className={ui.svc}>
      <div className={ui.svcImage} style={image ? {backgroundImage: `url(${image})`} : undefined} />
      <div className={ui.svcBody}>
        <h3>{title}</h3>
        <p>{text}</p>
        {price !== undefined && <div className={ui.svcPrice}>{intl.formatMessage({id: 'shared.price'}, {price})}</div>}
        <Link className={classnames(ui.btn)} href={href}>
          {intl.formatMessage({id: 'shared.service-call-to-action'})}
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
