import React from "react";

import { default as LandingFooter } from "./components/LandingFooter";
import { default as LandingHeader } from "./components/LandingHeader";
import { default as LandingMain } from "./components/LandingMain";

import styles from './Landing.module.scss';

const Landing: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* header */}
      <LandingHeader />

      {/* main */}
      <div className={styles.main}>
        <LandingMain />
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
