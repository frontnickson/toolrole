import React from 'react';
import { TaskStatus } from '../../../../types';
import styles from './TodoFilter.module.scss';

interface TodoFilterProps {
  currentFilter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange
}) => {
  const filters = [
    { value: 'all', label: 'Все задачи' },
    { value: TaskStatus.PLANNING, label: 'Планирование' },
    { value: TaskStatus.IN_PROGRESS, label: 'В работе' },
    { value: TaskStatus.COMPLETED, label: 'Завершено' }
  ];

  return (
    <div className={styles.todoFilter}>
      <h3>Фильтры</h3>
      
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Поиск по задачам..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>
      
      <div className={styles.filterOptions}>
        <h4>Статус</h4>
        {filters.map((filter) => (
          <label key={filter.value} className={styles.filterOption}>
            <input
              type="radio"
              name="statusFilter"
              value={filter.value}
              checked={currentFilter === filter.value}
              onChange={() => onFilterChange(filter.value as TaskStatus | 'all')}
            />
            <span className={styles.filterLabel}>{filter.label}</span>
          </label>
        ))}
      </div>
      
      <div className={styles.filterStats}>
        <h4>Статистика</h4>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>📊</span>
            <span className={styles.statLabel}>Всего задач</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>⏳</span>
            <span className={styles.statLabel}>В работе</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>✅</span>
            <span className={styles.statLabel}>Завершено</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;
