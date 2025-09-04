import React, { useState } from 'react';
import styles from './AuthForms.module.scss';

interface ProfessionSelectionProps {
  onNext: (profession: string) => void;
  onBack: () => void;
}

// Популярные профессии в IT и дизайне
const PROFESSIONS = [
  {
    id: 'frontend-developer',
    name: 'Frontend разработчик',
    icon: '💻',
    description: 'Разработка пользовательских интерфейсов'
  },
  {
    id: 'backend-developer',
    name: 'Backend разработчик',
    icon: '⚙️',
    description: 'Разработка серверной части приложений'
  },
  {
    id: 'fullstack-developer',
    name: 'Fullstack разработчик',
    icon: '🔄',
    description: 'Полный цикл разработки приложений'
  },
  {
    id: 'mobile-developer',
    name: 'Mobile разработчик',
    icon: '📱',
    description: 'Разработка мобильных приложений'
  },
  {
    id: 'ui-designer',
    name: 'UI дизайнер',
    icon: '🎨',
    description: 'Дизайн пользовательских интерфейсов'
  },
  {
    id: 'ux-designer',
    name: 'UX дизайнер',
    icon: '🧠',
    description: 'Дизайн пользовательского опыта'
  },
  {
    id: 'graphic-designer',
    name: 'Графический дизайнер',
    icon: '🖼️',
    description: 'Создание визуального контента'
  },
  {
    id: 'product-designer',
    name: 'Product дизайнер',
    icon: '📦',
    description: 'Дизайн продуктов и стратегия'
  },
  {
    id: 'qa-engineer',
    name: 'QA инженер',
    icon: '🔍',
    description: 'Тестирование и контроль качества'
  },
  {
    id: 'devops-engineer',
    name: 'DevOps инженер',
    icon: '☁️',
    description: 'Автоматизация и инфраструктура'
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: '📊',
    description: 'Анализ данных и машинное обучение'
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    icon: '📈',
    description: 'Управление продуктом'
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    icon: '📋',
    description: 'Управление проектами'
  },
  {
    id: 'marketing-manager',
    name: 'Marketing Manager',
    icon: '📢',
    description: 'Маркетинг и продвижение'
  },
  {
    id: 'content-manager',
    name: 'Content Manager',
    icon: '✍️',
    description: 'Создание и управление контентом'
  },
  {
    id: 'system-administrator',
    name: 'Системный администратор',
    icon: '🖥️',
    description: 'Администрирование IT-систем'
  },
  {
    id: 'cybersecurity-specialist',
    name: 'Специалист по кибербезопасности',
    icon: '🔒',
    description: 'Информационная безопасность'
  },
  {
    id: 'business-analyst',
    name: 'Бизнес-аналитик',
    icon: '📊',
    description: 'Анализ бизнес-процессов'
  },
  {
    id: 'sales-manager',
    name: 'Sales Manager',
    icon: '💰',
    description: 'Продажи и работа с клиентами'
  },
  {
    id: 'hr-specialist',
    name: 'HR специалист',
    icon: '👥',
    description: 'Управление персоналом'
  },
  {
    id: 'other',
    name: 'Другое',
    icon: '🔧',
    description: 'Укажите свою профессию'
  }
];

const ProfessionSelection: React.FC<ProfessionSelectionProps> = ({ onNext, onBack }) => {
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [customProfession, setCustomProfession] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Фильтрация профессий по поисковому запросу
  const filteredProfessions = PROFESSIONS.filter(profession =>
    profession.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profession.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfessionSelect = (professionId: string) => {
    setSelectedProfession(professionId);
    if (professionId !== 'other') {
      setCustomProfession('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProfession === 'other' && !customProfession.trim()) {
      return;
    }
    
    const profession = selectedProfession === 'other' ? customProfession.trim() : selectedProfession;
    onNext(profession);
  };

  const selectedProfessionData = PROFESSIONS.find(p => p.id === selectedProfession);

  return (
    <div className={styles.professionFormContainer}>
      <div className={styles.stepHeader}>
        <h2>Выберите профессию</h2>
        <p className={styles.subtitle}>Это поможет нам лучше понять ваши потребности</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Поиск */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Поиск профессии..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchField}
            />
          </div>
        </div>

        {/* Список профессий */}
        <div className={styles.professionsGrid}>
          {filteredProfessions.map((profession) => (
            <div
              key={profession.id}
              className={`${styles.professionCard} ${
                selectedProfession === profession.id ? styles.professionCardSelected : ''
              }`}
              onClick={() => handleProfessionSelect(profession.id)}
            >
              <div className={styles.professionIcon}>{profession.icon}</div>
              <div className={styles.professionContent}>
                <h3 className={styles.professionName}>{profession.name}</h3>
                <p className={styles.professionDescription}>{profession.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Кастомная профессия */}
        {selectedProfession === 'other' && (
          <div className={styles.customProfessionContainer}>
            <label htmlFor="customProfession" className={styles.label}>
              Укажите вашу профессию
            </label>
            <input
              type="text"
              id="customProfession"
              value={customProfession}
              onChange={(e) => setCustomProfession(e.target.value)}
              className={styles.input}
              placeholder="Введите название профессии"
            />
          </div>
        )}

        {/* Выбранная профессия */}
        {selectedProfessionData && selectedProfession !== 'other' && (
          <div className={styles.selectedProfession}>
            <div className={styles.selectedProfessionIcon}>{selectedProfessionData.icon}</div>
            <div className={styles.selectedProfessionContent}>
              <h4>✅ Выбрано: {selectedProfessionData.name}</h4>
              <p>{selectedProfessionData.description}</p>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onBack}
            className={styles.backButton}
          >
            Назад
          </button>
          
          <button
            type="submit"
            className={styles.nextButton}
            disabled={!selectedProfession || (selectedProfession === 'other' && !customProfession.trim())}
          >
            Завершить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfessionSelection;

