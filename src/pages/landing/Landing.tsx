import React from "react";

import { LandingHeader, LandingFooter } from "./components";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import AgentAI from "./sections/AgentAI";
import Price from "./sections/Price";
// import Contact from "./sections/Contact";

import styles from './Landing.module.scss';

const Landing: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Header */}
      <LandingHeader />

      {/* Main content */}
      <main className={styles.main}>
        <div id="main">
          <Hero />
        </div>
        <div id="about">
          <Features />
        </div>
        <AgentAI />
        <div id="price">
          <Price />
        </div>
        {/* <div id="contact">
          <Contact />
        </div> */}
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
