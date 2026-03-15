'use client';

import React, {useState, useEffect} from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

import Footer from '../Footer';
import Header from '../Header';
import Menu from '../Menu';

const PageLayout = ({children, footerClassName, headerWithTitle, pageWrapperClassName}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleToggleMenu = () => setIsMenuVisible((prev) => !prev);

  const pageWrapperMenuVisibilityClassName = isMenuVisible ? styles['page-wrapper--menu-visible'] : null;
  const globalIsLoadingClassName = isLoading ? 'is-loading' : null;

  return (
    <div>
      <div
        className={classnames(
          styles['page-wrapper'],
          pageWrapperMenuVisibilityClassName,
          pageWrapperClassName,
          globalIsLoadingClassName
        )}
      >
        <Header withTitle={headerWithTitle} onToggleMenu={handleToggleMenu} />
        {children}
        <Footer className={footerClassName} />
      </div>

      <Menu onToggleMenu={handleToggleMenu} isVisible={isMenuVisible} />
    </div>
  );
};

export default PageLayout;
