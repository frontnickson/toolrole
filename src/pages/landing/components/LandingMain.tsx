import React from 'react';
import Hero from '../sections/Hero/Hero';

import image from '../../../assets/images/background.jpg';

import styles from './LandingMain.module.scss'

const LandingMain: React.FC = () => {
  return (
    <main className={styles.container}>

      <div  className={styles.hero} style={{backgroundColor: `url(${image})`}}>
        <Hero />
      </div>

    </main>
  );
};

export default LandingMain;