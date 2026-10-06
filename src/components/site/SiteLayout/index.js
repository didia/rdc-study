'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import styles from './styles.module.scss';
import ui from '../ui.module.scss';
import NewsletterBand from '../NewsletterBand';
import config from '../../../../config';

const NAV_ITEMS = [
  {labelKey: 'site.nav.home', href: '/'},
  {labelKey: 'site.nav.guides', href: '/guides'},
  {labelKey: 'site.nav.scholarships', href: '/bourses'},
  {labelKey: 'site.nav.services', href: '/nos-services'},
  {labelKey: 'site.nav.articles', href: '/articles'},
  {labelKey: 'site.nav.about', href: '/a-propos'},
  {labelKey: 'site.nav.faq', href: '/questions-populaires'}
];

const FOOTER_LINKS = [
  {labelKey: 'site.footer.guides', href: '/guides'},
  {labelKey: 'site.footer.scholarships', href: '/bourses'},
  {labelKey: 'site.footer.services', href: '/nos-services'},
  {labelKey: 'site.footer.about', href: '/a-propos'},
  {labelKey: 'site.footer.faq', href: '/questions-populaires'},
  {labelKey: 'site.footer.partners', href: '/nos-partenaires'},
  {labelKey: 'site.footer.legal', href: '/assistance-visa'},
  {labelKey: 'site.footer.contact', href: config.contact.email.link, external: true},
  {labelKey: 'site.footer.facebook', href: config.contact.facebook.link, external: true, newTab: true},
  {labelKey: 'site.footer.privacy', href: '/politique-de-confidentialite'}
];

const Brand = ({className}) => {
  const intl = useIntl();

  return (
    <Link href="/" className={classnames(styles.brand, className)}>
      <Image src="/logo.png" width={40} height={40} alt="" priority />
      {intl.formatMessage({id: 'header.title'})}
    </Link>
  );
};

export const SiteHeader = ({active}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Brand />

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls="site-nav"
        aria-label={intl.formatMessage({id: 'site.nav.menu-label'})}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div id="site-nav" className={classnames(styles.menu, isOpen && styles.menuOpen)}>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classnames(item.href === active && styles.active)}
              aria-current={item.href === active ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
            >
              {intl.formatMessage({id: item.labelKey})}
            </Link>
          ))}
        </nav>
        <Link className={ui.btn} href="/accompagnement">
          {intl.formatMessage({id: 'site.nav.cta'})}
        </Link>
      </div>
    </header>
  );
};

export const SiteFooter = () => {
  const intl = useIntl();
  const {address} = config.contact;

  return (
    <footer className={styles.footer}>
      <div>
        <Brand className={styles.footerBrand} />
        <p className={styles.tagline}>{intl.formatMessage({id: 'site.footer.tagline'})}</p>
        <p className={styles.address}>
          {address.name}, {address.streetAddress}, {address.locality}, {address.country}
        </p>
        <p className={styles.address}>{intl.formatMessage({id: 'site.footer.rights'})}</p>
      </div>
      <nav className={styles.footerNav}>
        {FOOTER_LINKS.map((link) => {
          const label = intl.formatMessage({id: link.labelKey});
          if (link.external) {
            return (
              <a
                key={link.labelKey}
                href={link.href}
                {...(link.newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
              >
                {label}
              </a>
            );
          }
          return (
            <Link key={link.labelKey} href={link.href}>
              {label}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};

/**
 * Page shell for the redesigned pages: light header, content, optional newsletter band and footer.
 * `active` is the nav href of the current page.
 */
const SiteLayout = ({active, children, withNewsletter = true, newsletterTone}) => (
  <div className={ui.site}>
    <SiteHeader active={active} />
    <main>{children}</main>
    {withNewsletter && <NewsletterBand tone={newsletterTone} />}
    <SiteFooter />
  </div>
);

export default SiteLayout;
