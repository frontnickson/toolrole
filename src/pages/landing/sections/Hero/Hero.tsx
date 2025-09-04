import React from "react";
import styles from "./Hero.module.scss";
import Button from "../../../../components/ui/Button/Button";

import image from '../../../../assets/images/background.jpg';
import heroImage from '../../../../assets/images/hero.png';
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      aria-labelledby="hero-title"
    >
      <div className={styles.container}>
        
        <div className={styles.content}>
          <div className={styles.main}>
            <header className={styles.header}>
              <h1 id="hero-title" className={styles.title}>
                Твоя новая продуктивная суперсила
              </h1>
              <p className={styles.subtitle}>
                <strong>Toolrole</strong> сервис который поможет получать практический опыт. <br />
                Окунитесь в действительно важные задачи на каждый день.
              </p>
            </header>

            <div className={styles.ctaSection}>
              <Link to="/todo">
                <Button variant="primary" size="lg">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </div>

          <div className={styles.imageContainer}>
            <img
              src={heroImage}
              alt="Иллюстрация продуктивности и эффективности"
              className={styles.image}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;