import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './DestinationTiles.module.scss';

const DestinationTiles = ({guides}) => (
  <div className={styles.tiles}>
    {guides.map((guide) => (
      <Link key={guide.path} href={guide.path} className={styles.tile}>
        <Image
          src={guide.thumbnail}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 200px"
          style={{objectFit: 'cover'}}
        />
        <span>{guide.name}</span>
      </Link>
    ))}
  </div>
);

export default DestinationTiles;
