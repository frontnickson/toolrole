import React from 'react';

import { cardItem } from '../../../../constants/cards';
import type { CardItem } from '../../../../types/navigation';

import styles from './Features.module.scss';

const Features: React.FC = () => {
  const renderFeatureCard = (card: CardItem) => (
    <article key={card.id} className={styles.cardItem}>
      <div className={styles.cardContent}>
        <div className={styles.cardIcon}>
          <img 
            src={card.image} 
            alt={`${card.title} - иконка`} 
            className={styles.icon}
            loading="lazy"
          />
        </div>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{card.title}</h2>
        </header>
        <p className={styles.cardDescription}>{card.description}</p>
      </div>
    </article>
  );

  return (
    <section className={styles.container} aria-labelledby="features-title">
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 id="features-title" className={styles.title}>
            Инструмент для любого проекта
          </h1>
          <p className={styles.subtitle}>
            <strong>Toolrole</strong> это инструмент нового вида, где каждый может получить реальный опыт и быть более конкурентным
          </p>
        </header>

        <div className={styles.cardsGrid}>
          {cardItem.map(renderFeatureCard)}
        </div>
      </div>
    </section>
  );
};

export default Features;