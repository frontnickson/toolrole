import React, { useState, useRef, useEffect } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import styles from './TodoSearch.module.scss';

interface TodoSearchProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  assignee?: string | 'all';
  tags?: string[];
}

const TodoSearch: React.FC<TodoSearchProps> = ({ tasks, onTaskClick, isOpen, onClose}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ status: 'all', priority: 'all', assignee: 'all', tags: [] });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Автофокус при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    // Поиск по тексту
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Фильтр по статусу
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Фильтр по приоритету
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Фильтр по исполнителю
    if (filters.assignee && filters.assignee !== 'all' && task.assigneeId !== filters.assignee) {
      return false;
    }

    return true;
  });

  const handleTaskSelect = (taskId: string) => {
    console.log('TodoSearch: handleTaskSelect вызван с taskId:', taskId);
    console.log('TodoSearch: onTaskClick функция:', onTaskClick);
    
    try {
      onTaskClick(taskId);
      console.log('TodoSearch: onTaskClick выполнен успешно');
      onClose();
      setSearchQuery('');
    } catch (error) {
      console.error('TodoSearch: Ошибка при выполнении onTaskClick:', error);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      assignee: 'all',
      tags: []
    });
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PLANNING: return 'Планирование';
      case TaskStatus.IN_PROGRESS: return 'В работе';
      case TaskStatus.REVIEW: return 'На проверке';
      case TaskStatus.TESTING: return 'Тестирование';
      case TaskStatus.COMPLETED: return 'Завершено';
      case TaskStatus.CANCELLED: return 'Отменено';
      case TaskStatus.BLOCKED: return 'Заблокировано';
      case TaskStatus.ON_HOLD: return 'На паузе';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return 'Критичный';
      case TaskPriority.LOW: return 'Низкий';
      case TaskPriority.MEDIUM: return 'Средний';
      case TaskPriority.HIGH: return 'Высокий';
      case TaskPriority.URGENT: return 'Срочно';
      default: return priority;
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return '💥';
      case TaskPriority.LOW: return '🟢';
      case TaskPriority.MEDIUM: return '🟡';
      case TaskPriority.HIGH: return '🔴';
      case TaskPriority.URGENT: return '🔥';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PLANNING: return '📅';
      case TaskStatus.IN_PROGRESS: return '⚡';
      case TaskStatus.REVIEW: return '👀';
      case TaskStatus.TESTING: return '🧪';
      case TaskStatus.COMPLETED: return '✅';
      case TaskStatus.CANCELLED: return '❌';
      case TaskStatus.BLOCKED: return '🚫';
      case TaskStatus.ON_HOLD: return '⏸️';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.searchOverlay}>
      <div ref={searchRef} className={styles.searchContainer}>
        {/* Заголовок поиска */}
        <div className={styles.searchHeader}>
          <h3>Поиск задач</h3>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        {/* Строка поиска */}
        <div className={styles.searchInputContainer}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Введите название задачи, описание или тег..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
              >
                ✕
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
          >
            🔧 Фильтры
          </button>
        </div>

        {/* Расширенные фильтры */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>Статус:</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters({...filters, status: e.target.value as TaskStatus | 'all'})}
                >
                  <option value="all">Все статусы</option>
                  <option value={TaskStatus.PLANNING}>Планирование</option>
                  <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                  <option value={TaskStatus.REVIEW}>На проверке</option>
                  <option value={TaskStatus.TESTING}>Тестирование</option>
                  <option value={TaskStatus.COMPLETED}>Завершено</option>
                  <option value={TaskStatus.CANCELLED}>Отменено</option>
                  <option value={TaskStatus.BLOCKED}>Заблокировано</option>
                  <option value={TaskStatus.ON_HOLD}>На паузе</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Приоритет:</label>
                <select
                  value={filters.priority || 'all'}
                  onChange={(e) => setFilters({...filters, priority: e.target.value as TaskPriority | 'all'})}
                >
                  <option value="all">Все приоритеты</option>
                  <option value={TaskPriority.CRITICAL}>Критичный</option>
                  <option value={TaskPriority.LOW}>Низкий</option>
                  <option value={TaskPriority.MEDIUM}>Средний</option>
                  <option value={TaskPriority.HIGH}>Высокий</option>
                  <option value={TaskPriority.URGENT}>Срочно</option>
                </select>
              </div>

              <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}

        {/* Результаты поиска */}
        <div className={styles.searchResults}>
          {searchQuery === '' && (
            <div className={styles.searchHint}>
              <span className={styles.hintIcon}>💡</span>
              <p>Начните вводить название задачи, описание или тег для поиска</p>
            </div>
          )}

          {searchQuery !== '' && filteredTasks.length === 0 && (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <p>Ничего не найдено</p>
              <small>Попробуйте изменить запрос или сбросить фильтры</small>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <span>Найдено задач: {filteredTasks.length}</span>
              </div>
              
              <div className={styles.resultsList}>
                {filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={styles.resultItem}
                    onClick={() => handleTaskSelect(task.id)}
                  >
                    <div className={styles.taskHeader}>
                      <h4 className={styles.taskTitle}>{task.title}</h4>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskStatus}>
                          {getStatusIcon(task.status)} {getStatusLabel(task.status)}
                        </span>
                        <span className={styles.taskPriority}>
                          {getPriorityIcon(task.priority)} {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={styles.taskDescription}>
                        {task.description.length > 100 
                          ? `${task.description.substring(0, 100)}...` 
                          : task.description
                        }
                      </p>
                    )}
                    
                    {task.tags.length > 0 && (
                      <div className={styles.taskTags}>
                        {task.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className={styles.tag}>#{tag.name}</span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className={styles.moreTags}>+{task.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div className={styles.taskDueDate}>
                        📅 {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoSearch;
