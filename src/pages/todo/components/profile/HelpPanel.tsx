import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import styles from './HelpPanel.module.scss';

interface HelpPanelProps {
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  const helpCategories = [
    { id: 'getting-started', title: t('help.getting_started'), icon: '🚀' },
    { id: 'boards', title: t('help.boards'), icon: '📋' },
    { id: 'tasks', title: t('help.tasks'), icon: '✅' },
    { id: 'collaboration', title: t('help.collaboration'), icon: '👥' },
    { id: 'settings', title: t('help.settings'), icon: '⚙️' },
    { id: 'troubleshooting', title: t('help.troubleshooting'), icon: '🔧' }
  ];

  const helpContent = {
    'getting-started': {
      title: t('help.getting_started'),
      content: [
        {
          question: t('help.how_create_first_board'),
          answer: t('help.how_create_first_board_answer')
        },
        {
          question: t('help.how_add_task'),
          answer: t('help.how_add_task_answer')
        },
        {
          question: t('help.how_switch_modes'),
          answer: t('help.how_switch_modes_answer')
        }
      ]
    },
    'boards': {
      title: t('help.boards'),
      content: [
        {
          question: t('help.how_change_board_name'),
          answer: t('help.how_change_board_name_answer')
        },
        {
          question: t('help.how_add_favorite'),
          answer: t('help.how_add_favorite_answer')
        },
        {
          question: t('help.how_share_board'),
          answer: t('help.how_share_board_answer')
        }
      ]
    },
    'tasks': {
      title: t('help.tasks'),
      content: [
        {
          question: t('help.how_assign_executor'),
          answer: t('help.how_assign_executor_answer')
        },
        {
          question: t('help.how_set_due_date'),
          answer: t('help.how_set_due_date_answer')
        },
        {
          question: t('help.how_add_comment'),
          answer: t('help.how_add_comment_answer')
        }
      ]
    }
  };

  return (
    <div className={styles.helpPanel}>
      <div className={styles.header}>
        <h2>{t('help.title')}</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.categoriesSection}>
          <h3>{t('help.categories')}</h3>
          <div className={styles.categoriesList}>
            {helpCategories.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.contentSection}>
          {helpContent[activeCategory as keyof typeof helpContent] ? (
            <>
              <h3>{helpContent[activeCategory as keyof typeof helpContent].title}</h3>
              <div className={styles.helpItems}>
                {helpContent[activeCategory as keyof typeof helpContent].content.map((item, index) => (
                  <div key={index} className={styles.helpItem}>
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyContent}>
              <span className={styles.emptyIcon}>📚</span>
              <h3>{t('help.select_category')}</h3>
              <p>{t('help.select_category_desc')}</p>
            </div>
          )}
        </div>

        <div className={styles.searchSection}>
          <h3>{t('help.search_help')}</h3>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder={t('help.enter_question')}
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              🔍
            </button>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h3>{t('help.not_found_answer')}</h3>
          <p>{t('help.support_ready')}</p>
          <div className={styles.contactButtons}>
            <button className={styles.contactBtn}>
              💬 {t('help.chat_support')}
            </button>
            <button className={styles.contactBtn}>
              📧 {t('help.write_email')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPanel;
