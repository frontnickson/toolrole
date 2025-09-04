import React from 'react';
import styles from './AuthForms.module.scss';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <div className={styles.welcomeIcon}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="40" fill="url(#welcomeGradient)"/>
            <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="welcomeGradient" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5"/>
                <stop offset="1" stopColor="#7C3AED"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <h1 className={styles.welcomeTitle}>Добро пожаловать!</h1>
        <p className={styles.welcomeSubtitle}>
          Давайте создадим ваш профиль и настроим все необходимое для комфортной работы
        </p>
        
        <div className={styles.welcomeFeatures}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>👤</div>
            <span>Создание профиля</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💼</div>
            <span>Выбор профессии</span>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📸</div>
            <span>Загрузка фото</span>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={onNext}
          className={styles.welcomeButton}
        >
          Начать настройку
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;

