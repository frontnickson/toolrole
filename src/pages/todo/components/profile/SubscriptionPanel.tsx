import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import styles from './SubscriptionPanel.module.scss';

interface SubscriptionPanelProps {
  onClose: () => void;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ onClose }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  return (
    <div className={styles.subscriptionPanel}>
      <div className={styles.header}>
        <h2>{t('subscription.title')}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.currentPlan}>
          <div className={styles.planHeader}>
            <h3>{t('subscription.current_plan')}</h3>
            <span className={styles.planBadge}>{t('subscription.free_plan')}</span>
          </div>
          <p>{t('subscription.free_plan_desc')}</p>
        </div>

        <div className={styles.featuresSection}>
          <h3>{t('subscription.what_included')}</h3>
          <ul className={styles.featuresList}>
            <li>✅ {t('subscription.up_to_boards')}</li>
            <li>✅ {t('subscription.basic_templates')}</li>
            <li>✅ {t('subscription.up_to_tasks')}</li>
            <li>✅ {t('subscription.basic_support')}</li>
          </ul>
        </div>

        <div className={styles.premiumSection}>
          <div className={styles.premiumHeader}>
            <h3>🚀 {t('subscription.premium_plan')}</h3>
            <div className={styles.price}>
              <span className={styles.currency}>₽</span>
              <span className={styles.amount}>999</span>
              <span className={styles.period}>/месяц</span>
            </div>
          </div>
          
          <div className={styles.premiumFeatures}>
            <h4>{t('subscription.additional_features')}</h4>
            <ul className={styles.premiumFeaturesList}>
              <li>✨ {t('subscription.unlimited_boards')}</li>
              <li>✨ {t('subscription.advanced_templates')}</li>
              <li>✨ {t('subscription.unlimited_tasks')}</li>
              <li>✨ {t('subscription.priority_support')}</li>
              <li>✨ {t('subscription.analytics_reports')}</li>
              <li>✨ {t('subscription.integrations')}</li>
              <li>✨ {t('subscription.backup')}</li>
              <li>✨ {t('subscription.teams_collaboration')}</li>
            </ul>
          </div>

          <button className={styles.upgradeBtn}>
            {t('subscription.upgrade_to_premium')}
          </button>
        </div>

        <div className={styles.billingSection}>
          <h3>{t('subscription.payment_methods')}</h3>
          <div className={styles.paymentMethods}>
            <div className={styles.paymentMethod}>
              <span className={styles.paymentIcon}>💳</span>
              <span>{t('subscription.bank_cards')}</span>
            </div>
            <div className={styles.paymentMethod}>
              <span className={styles.paymentIcon}>🏦</span>
              <span>{t('subscription.bank_transfers')}</span>
            </div>
            <div className={styles.paymentMethod}>
              <span className={styles.paymentIcon}>📱</span>
              <span>{t('subscription.e_wallets')}</span>
            </div>
          </div>
        </div>

        <div className={styles.supportSection}>
          <h3>{t('subscription.need_help')}</h3>
          <p>{t('subscription.support_ready')}</p>
          <button className={styles.supportBtn}>
            {t('subscription.contact_support')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPanel;
