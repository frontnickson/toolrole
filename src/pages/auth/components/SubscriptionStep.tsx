import React, { useState } from 'react';
import styles from './AuthForms.module.scss';

interface SubscriptionStepProps {
  onSubscribe: (plan: string) => void;
  onSkip: () => void;
}

const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Базовый',
    price: '0',
    period: 'навсегда',
    description: 'Основные возможности для начала работы',
    features: [
      'Создание досок и задач',
      'Базовые шаблоны',
      'Командная работа (до 3 участников)',
      'Мобильное приложение',
      'Поддержка 24/7'
    ],
    popular: false,
    buttonText: 'Начать бесплатно',
    buttonStyle: 'secondary'
  },
  {
    id: 'pro',
    name: 'Профессиональный',
    price: '990',
    period: 'в месяц',
    description: 'Для профессионалов и команд',
    features: [
      'Все возможности Базового',
      'Неограниченные участники',
      'Расширенные шаблоны',
      'Интеграции с внешними сервисами',
      'Приоритетная поддержка',
      'Аналитика и отчеты',
      'Настраиваемые поля',
      'Автоматизация процессов'
    ],
    popular: true,
    buttonText: 'Выбрать Про',
    buttonStyle: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Корпоративный',
    price: '2990',
    period: 'в месяц',
    description: 'Для крупных организаций',
    features: [
      'Все возможности Профессионального',
      'Персональный менеджер',
      'SSO и корпоративная безопасность',
      'API и кастомные интеграции',
      'Обучение команды',
      'SLA 99.9%',
      'Резервное копирование',
      'Кастомные брендинг'
    ],
    popular: false,
    buttonText: 'Связаться с нами',
    buttonStyle: 'secondary'
  }
];

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ onSubscribe, onSkip }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
  };

  return (
    <div className={styles.subscriptionContainer}>
      <div className={styles.stepHeader}>
        <h2>Выберите подписку</h2>
        <p className={styles.subtitle}>
          Начните с бесплатного плана или выберите подходящий тариф для максимальной продуктивности
        </p>
      </div>



      {/* Тарифные планы */}
      <div className={styles.plansSection}>
        <div className={styles.plansGrid}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${
                plan.popular ? styles.planCardPopular : ''
              } ${selectedPlan === plan.id ? styles.planCardSelected : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Популярный</div>
              )}
              
              <div className={styles.planHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.price}₽</span>
                  <span className={styles.pricePeriod}>/{plan.period}</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>

              <div className={styles.planFeatures}>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className={styles.featureIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.planFooter}>
                <button
                  className={`${styles.planButton} ${
                    plan.buttonStyle === 'primary' ? styles.planButtonPrimary : styles.planButtonSecondary
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe();
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className={styles.subscriptionActions}>
        <button
          type="button"
          onClick={onSkip}
          className={styles.skipButton}
        >
          Пропустить пока
        </button>
        
        <div className={styles.subscriptionNote}>
          <p>💡 Вы всегда можете изменить подписку в настройках профиля</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStep;
