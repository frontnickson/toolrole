import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button, BackButton } from '../../components/ui/Button';
import styles from './Subscription.module.scss';

const Subscription: React.FC = () => {
  const { user, isLoading } = useAuth();
  useTheme(); // Применяем тему к странице подписки
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan] = useState('free');
  const [plans] = useState([
    {
      id: 'free',
      name: 'Бесплатный',
      price: 0,
      currency: '₽',
      period: 'навсегда',
      features: ['Базовые функции', '5 проектов', 'Базовая поддержка'],
      popular: false
    },
    {
      id: 'pro',
      name: 'Профессиональный',
      price: 999,
      currency: '₽',
      period: 'в месяц',
      features: ['Все функции', 'Неограниченные проекты', 'Приоритетная поддержка', 'Аналитика'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Корпоративный',
      price: 2999,
      currency: '₽',
      period: 'в месяц',
      features: ['Все функции Pro', 'Командная работа', 'API доступ', 'Персональный менеджер'],
      popular: false
    }
  ]);

  useEffect(() => {
    if (user) {
      setCurrentPlan(user.subscription?.plan || 'free');
    }
  }, [user]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (selectedPlan && billingPeriod) {
      // Здесь будет логика подписки
    }
  };

  const handleBillingToggle = () => {
    setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };



  if (isLoading) {
    return (
      <div className={styles.subscriptionPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка подписки...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.subscriptionPage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.subscriptionPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <BackButton>К профилю</BackButton>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Подписка</h1>
            <p className={styles.subtitle}>Выберите план, который подходит именно вам</p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Текущий план */}
          <div className={styles.currentPlan}>
            <h2 className={styles.currentPlanTitle}>Текущий план</h2>
            <div className={styles.currentPlanCard}>
              <div className={styles.currentPlanInfo}>
                <span className={styles.currentPlanName}>
                  {plans.find(p => p.id === currentPlan)?.name}
                </span>
                <span className={styles.currentPlanStatus}>Активен</span>
              </div>
              {currentPlan !== 'free' && (
                <div className={styles.currentPlanDetails}>
                  <span className={styles.currentPlanPrice}>
                    {plans.find(p => p.id === currentPlan)?.price}
                  </span>
                  <span className={styles.currentPlanPeriod}>
                    {plans.find(p => p.id === currentPlan)?.period}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Переключатель периода */}
          <div className={styles.billingToggle}>
            <span className={billingPeriod === 'monthly' ? styles.active : ''}>Месячно</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={billingPeriod === 'yearly'}
                onChange={handleBillingToggle}
              />
              <span className={styles.slider}></span>
            </label>
            <span className={billingPeriod === 'yearly' ? styles.active : ''}>
              Годово
              <span className={styles.discount}>Скидка 20%</span>
            </span>
          </div>

          {/* Планы */}
          <div className={styles.plans}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${selectedPlan === plan.id ? styles.selected : ''} ${
                  plan.popular ? styles.popular : ''
                }`}
              >
                {plan.popular && <div className={styles.popularBadge}>Популярный</div>}
                
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>
                      {plan.price === 0 ? 'Бесплатно' : `${plan.price} ${plan.currency}`}
                    </span>
                    {plan.price > 0 && (
                      <span className={styles.period}>/{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.featureIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={styles.planActions}>
                  {plan.id === 'free' ? (
                    <Button
                      variant="secondary"
                      className={styles.planButton}
                      disabled
                    >
                      Текущий план
                    </Button>
                  ) : (
                    <Button
                      variant={selectedPlan === plan.id ? 'primary' : 'secondary'}
                      className={styles.planButton}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Выбрано' : 'Выбрать'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Действия */}
          {selectedPlan !== 'free' && (
            <div className={styles.actions}>
              <Button variant="primary" size="lg" onClick={handleSubscribe}>
                Подписаться на {plans.find(p => p.id === selectedPlan)?.name}
              </Button>
              <p className={styles.terms}>
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="/terms" className={styles.termsLink}>
                  условиями использования
                </a>
              </p>
            </div>
          )}

          {/* FAQ */}
          <div className={styles.faq}>
            <h2 className={styles.faqTitle}>Часто задаваемые вопросы</h2>
            <div className={styles.faqItems}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Могу ли я отменить подписку?</h3>
                <p className={styles.faqAnswer}>
                  Да, вы можете отменить подписку в любое время. Доступ к функциям Pro сохранится до конца оплаченного периода.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Есть ли пробный период?</h3>
                <p className={styles.faqAnswer}>
                  Да, мы предоставляем 14-дневный пробный период для всех платных планов без привязки карты.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Какие способы оплаты принимаются?</h3>
                <p className={styles.faqAnswer}>
                  Мы принимаем все основные кредитные карты, PayPal и банковские переводы для годовых планов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
