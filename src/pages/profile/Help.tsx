import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, BackButton } from '../../components/ui/Button';
import styles from './Help.module.scss';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const Help: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Как создать новую доску?',
      answer: 'Нажмите на кнопку "+" в верхней части интерфейса или используйте сочетание клавиш Ctrl+N. Выберите шаблон доски и заполните необходимую информацию.',
      category: 'boards'
    },
    {
      id: '2',
      question: 'Как добавить участника в команду?',
      answer: 'Откройте настройки доски, перейдите в раздел "Участники" и нажмите "Добавить участника". Введите email или username пользователя.',
      category: 'teams'
    },
    {
      id: '3',
      question: 'Как изменить статус задачи?',
      answer: 'Перетащите задачу между колонками или нажмите на статус задачи и выберите новый статус из выпадающего списка.',
      category: 'tasks'
    },
    {
      id: '4',
      question: 'Как настроить уведомления?',
      answer: 'Перейдите в настройки профиля → Уведомления. Здесь вы можете настроить email, push и desktop уведомления для различных событий.',
      category: 'notifications'
    },
    {
      id: '5',
      question: 'Как экспортировать данные?',
      answer: 'В настройках доски выберите "Экспорт" и выберите формат (CSV, PDF, Excel). Данные будут загружены на ваш компьютер.',
      category: 'export'
    },
    {
      id: '6',
      question: 'Как восстановить удаленную задачу?',
      answer: 'Удаленные задачи перемещаются в корзину. Перейдите в настройки доски → Корзина и восстановите нужную задачу.',
      category: 'tasks'
    },
    {
      id: '7',
      question: 'Как изменить тему приложения?',
      answer: 'Перейдите в настройки профиля → Внешний вид и выберите нужную тему: светлую, темную или автоматическую.',
      category: 'appearance'
    },
    {
      id: '8',
      question: 'Как создать шаблон доски?',
      answer: 'Настройте доску нужным образом, затем в настройках доски выберите "Сохранить как шаблон". Шаблон будет доступен при создании новых досок.',
      category: 'boards'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все вопросы', icon: '🔍' },
    { id: 'boards', name: 'Доски', icon: '📋' },
    { id: 'tasks', name: 'Задачи', icon: '✅' },
    { id: 'teams', name: 'Команды', icon: '👥' },
    { id: 'notifications', name: 'Уведомления', icon: '🔔' },
    { id: 'export', name: 'Экспорт', icon: '📤' },
    { id: 'appearance', name: 'Внешний вид', icon: '🎨' }
  ];

  useEffect(() => {
    console.log('🆘 Страница помощи загружена');
    console.log('🆘 Данные пользователя:', user);
    console.log('🆘 Выбранная категория:', selectedCategory);
  }, [user, selectedCategory]);

  const toggleExpanded = (id: string) => {
    console.log('📖 Переключение элемента:', id);
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSupport = () => {
    console.log('🆘 Связь с поддержкой');
    // Здесь будет логика связи с поддержкой
  };

  if (isLoading) {
    return (
      <div className={styles.helpPage}>
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка помощи...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.helpPage}>
        <div className={styles.container}>
          <div className={styles.error}>Пользователь не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.helpPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <BackButton>К профилю</BackButton>
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Помощь</h1>
            <p className={styles.subtitle}>Найдите ответы на часто задаваемые вопросы</p>
          </div>
        </header>

        <div className={styles.content}>
          {/* Поиск */}
          <div className={styles.searchSection}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Поиск по вопросам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          {/* Категории */}
          <div className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>Категории</h2>
            <div className={styles.categories}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category.id ? styles.active : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>
              Часто задаваемые вопросы
              {searchQuery && (
                <span className={styles.searchResults}>
                  Результаты поиска: {filteredItems.length}
                </span>
              )}
            </h2>
            
            <div className={styles.faqList}>
              {filteredItems.length === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🤔</span>
                  <h3 className={styles.emptyTitle}>Ничего не найдено</h3>
                  <p className={styles.emptyMessage}>
                    Попробуйте изменить поисковый запрос или выбрать другую категорию
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.id} className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => toggleExpanded(item.id)}
                    >
                      <span className={styles.questionText}>{item.question}</span>
                      <span className={`${styles.expandIcon} ${
                        expandedItems.has(item.id) ? styles.expanded : ''
                      }`}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedItems.has(item.id) && (
                      <div className={styles.faqAnswer}>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Связь с поддержкой */}
          <div className={styles.supportSection}>
            <div className={styles.supportCard}>
              <div className={styles.supportContent}>
                <h3 className={styles.supportTitle}>Нужна дополнительная помощь?</h3>
                <p className={styles.supportMessage}>
                  Не нашли ответ на свой вопрос? Наша команда поддержки готова помочь!
                </p>
                <div className={styles.supportActions}>
                  <Button variant="primary" onClick={handleContactSupport}>
                    Связаться с поддержкой
                  </Button>
                  <Button variant="secondary">
                    Отправить отзыв
                  </Button>
                </div>
              </div>
              <div className={styles.supportIcon}>💬</div>
            </div>
          </div>

          {/* Полезные ссылки */}
          <div className={styles.linksSection}>
            <h2 className={styles.sectionTitle}>Полезные ссылки</h2>
            <div className={styles.linksGrid}>
              <a href="/docs" className={styles.linkCard}>
                <span className={styles.linkIcon}>📚</span>
                <span className={styles.linkTitle}>Документация</span>
                <span className={styles.linkDescription}>Подробные руководства по всем функциям</span>
              </a>
              
              <a href="/tutorials" className={styles.linkCard}>
                <span className={styles.linkIcon}>🎓</span>
                <span className={styles.linkTitle}>Обучающие материалы</span>
                <span className={styles.linkDescription}>Видеоуроки и примеры использования</span>
              </a>
              
              <a href="/community" className={styles.linkCard}>
                <span className={styles.linkIcon}>🌐</span>
                <span className={styles.linkTitle}>Сообщество</span>
                <span className={styles.linkDescription}>Форум и обсуждения с другими пользователями</span>
              </a>
              
              <a href="/updates" className={styles.linkCard}>
                <span className={styles.linkIcon}>🆕</span>
                <span className={styles.linkTitle}>Обновления</span>
                <span className={styles.linkDescription}>Что нового в последних версиях</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
