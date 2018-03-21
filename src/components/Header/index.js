// Vendor
import React from 'react'
import Link from 'gatsby-link'

// Styles
import styles from './styles.module.scss'

const Header = () => (
  <div className={styles.header}>
    <div className={styles['header__inner-wrapper']}>
      <h1 style={{margin: 0}}>
        <Link to="/" className={styles.header__link}>
          Guide des études à l’Etranger
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
