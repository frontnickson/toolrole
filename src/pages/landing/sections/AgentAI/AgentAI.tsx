import React from 'react';

import image from '../../../../assets/images/landing/AgentAI.jpg';
import { agentList } from '../../../../constants/agentai';
import type { DescreptionItem } from '../../../../types/navigation';

import styles from './AgentAI.module.scss';

const AgentAI: React.FC = () => {
  const renderFeatureList = (features: DescreptionItem[]) => {
    return (
      <ul className={styles.featureList}>
        {features.map((feature) => (
          <li key={feature.id} className={styles.featureItem}>
            <span className={styles.bullet}>—</span>
            <span className={styles.description}>{feature.description}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className={styles.container} aria-labelledby="agent-ai-title">
      <div className={styles.content}>
        <div className={styles.textContent}>
          <header className={styles.header}>
            <h1 id="agent-ai-title" className={styles.title}>
              Ваш персональный <br />
              AI руководитель!
            </h1>
            <p className={styles.subtitle}>
              <strong>Что он может:</strong>
            </p>
          </header>
          
          {renderFeatureList(agentList)}
        </div>

        <div className={styles.imageContainer}>
          <img 
            src={image} 
            alt="AI руководитель - персональный помощник для управления задачами" 
            className={styles.image}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AgentAI;