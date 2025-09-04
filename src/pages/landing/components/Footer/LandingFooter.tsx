import React from 'react';

import styles from './LandingFooter.module.scss';

const LandingFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>О нас</h3>
            <p className={styles.description}>
              Инновационные решения для вашего бизнеса. Мы помогаем компаниям расти и развиваться.
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>Продукты</h3>
            <ul className={styles.links}>
              <li><a href="#features">Возможности</a></li>
              <li><a href="#pricing">Цены</a></li>
              <li><a href="#demo">Демо</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>Поддержка</h3>
            <ul className={styles.links}>
              <li><a href="#help">Помощь</a></li>
              <li><a href="#contact">Контакты</a></li>
              <li><a href="#docs">Документация</a></li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>Социальные сети</h3>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink}>Twitter</a>
              <a href="#" className={styles.socialLink}>LinkedIn</a>
              <a href="#" className={styles.socialLink}>Facebook</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © 2024 Ваша Компания. Все права защищены.
          </div>
          <div className={styles.legal}>
            <a href="#privacy">Политика конфиденциальности</a>
            <a href="#terms">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;