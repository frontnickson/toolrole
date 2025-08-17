import React from 'react';
import Button from '../../../../components/ui/Button/Button';

import image from '../../../../assets/images/background.jpg'

import styles from './Hero.module.scss';

const Hero: React.FC = () => {
  return (
    <section className={styles.container} style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className={styles.main}>

        <div className={styles.title}>
          <h1>Твоя новая <br/> продуктивная <br/>суперсила</h1>
          <p><b>Toolrole</b> сервис который поможет <br/>получать практический опыт</p>
        </div>

        <div>
          <Button>Начать бесплатно</Button>
        </div>

      </div>

    </section>
  );
};

export default Hero;