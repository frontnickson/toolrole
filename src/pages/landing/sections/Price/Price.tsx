import React from 'react';
import { priceList } from '../../../../constants/price';
import Button from '../../../../components/ui/Button/Button';
import styles from './Price.module.scss';

const Price: React.FC = () => {
    return ( 
        <section className={styles.container}>
            
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>Выберите подходящий тариф</h2>
                <p className={styles.sectionSubtitle}>
                    Начните бесплатно и масштабируйтесь по мере роста ваших потребностей
                </p>
            </div>
            
            <div className={styles.pricingGrid}>
                {priceList.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`${styles.pricingCard} ${index === 1 ? styles.popular : ''}`}
                    >
                        {/* {index === 1 && (
                            <div className={styles.popularBadge}>
                                <span>Популярный</span>
                            </div>
                        )} */}
                        
                        <div className={styles.cardHeader}>
                            <h3 className={styles.title}>{item.title}</h3>
                            <div className={styles.priceContainer}>
                                <span className={styles.currency}>₽</span>
                                <span className={styles.price}>
                                    {item.price === "0" ? "0" : item.price}
                                </span>
                                <span className={styles.period}>
                                    {item.price === "0" ? "Бесплатно" : "/мес"}
                                </span>
                            </div>
                        </div>
                        
                        <div className={styles.features}>
                            <h4 className={styles.featuresTitle}>Что включено:</h4>
                            <ul className={styles.featuresList}>
                                {item.includes.map((feature, featureIndex) => (
                                    <li key={featureIndex} className={styles.feature}>
                                        <div className={styles.featureIcon}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="currentColor"/>
                                            </svg>
                                        </div>
                                        <span>{feature.bonus}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className={styles.cardFooter}>
                            <Button 
                                variant={index === 1 ? "primary" : "secondary"} 
                                size="lg"
                                className={styles.ctaButton}
                            >
                                {item.price === "0" ? "Начать бесплатно" : "Выбрать тариф"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Все тарифы включают 14-дневную бесплатную пробную версию
                </p>
                <p className={styles.footerText}>
                    Нужна помощь с выбором? <a href="#contact" className={styles.footerLink}>Свяжитесь с нами</a>
                </p>
            </div>

        </section>
    );
};

export default Price;