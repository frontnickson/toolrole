import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
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
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ status: 'all', priority: 'all', assignee: 'all', tags: [] });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

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
    if (onTaskClick) {
      onTaskClick(taskId);
    }
    setSearchQuery('');
    // setIsDropdownOpen(false); // This line was removed from the new_code, so it's removed here.
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
      case TaskStatus.PLANNING: return t('tasks.planning');
      case TaskStatus.IN_PROGRESS: return t('tasks.in_progress');
      case TaskStatus.REVIEW: return t('tasks.review');
      case TaskStatus.TESTING: return t('tasks.testing');
      case TaskStatus.COMPLETED: return t('tasks.completed');
      case TaskStatus.CANCELLED: return t('tasks.cancelled');
      case TaskStatus.BLOCKED: return t('tasks.blocked');
      case TaskStatus.ON_HOLD: return t('tasks.on_hold');
      default: return status;
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return t('tasks.critical');
      case TaskPriority.LOW: return t('tasks.low');
      case TaskPriority.MEDIUM: return t('tasks.medium');
      case TaskPriority.HIGH: return t('tasks.high');
      case TaskPriority.URGENT: return t('tasks.urgent');
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
          <h3>{t('tasks.search_tasks')}</h3>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        {/* Строка поиска */}
        <div className={styles.searchInputContainer}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('tasks.enter_task_name')}
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
            🔧 {t('tasks.filters')}
          </button>
        </div>

        {/* Расширенные фильтры */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label>{t('tasks.status')}:</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => setFilters({...filters, status: e.target.value as TaskStatus | 'all'})}
                >
                  <option value="all">{t('tasks.all_statuses')}</option>
                  <option value={TaskStatus.PLANNING}>{t('tasks.planning')}</option>
                  <option value={TaskStatus.IN_PROGRESS}>{t('tasks.in_progress')}</option>
                  <option value={TaskStatus.REVIEW}>{t('tasks.review')}</option>
                  <option value={TaskStatus.TESTING}>{t('tasks.testing')}</option>
                  <option value={TaskStatus.COMPLETED}>{t('tasks.completed')}</option>
                  <option value={TaskStatus.CANCELLED}>{t('tasks.cancelled')}</option>
                  <option value={TaskStatus.BLOCKED}>{t('tasks.blocked')}</option>
                  <option value={TaskStatus.ON_HOLD}>{t('tasks.on_hold')}</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>{t('tasks.priority')}:</label>
                <select
                  value={filters.priority || 'all'}
                  onChange={(e) => setFilters({...filters, priority: e.target.value as TaskPriority | 'all'})}
                >
                  <option value="all">{t('tasks.all_priorities')}</option>
                  <option value={TaskPriority.CRITICAL}>{t('tasks.critical')}</option>
                  <option value={TaskPriority.LOW}>{t('tasks.low')}</option>
                  <option value={TaskPriority.MEDIUM}>{t('tasks.medium')}</option>
                  <option value={TaskPriority.HIGH}>{t('tasks.high')}</option>
                  <option value={TaskPriority.URGENT}>{t('tasks.urgent')}</option>
                </select>
              </div>

              <button onClick={handleClearFilters} className={styles.clearFiltersButton}>
{t('tasks.reset_filters')}
              </button>
            </div>
          </div>
        )}

        {/* Результаты поиска */}
        <div className={styles.searchResults}>
          {searchQuery === '' && (
            <div className={styles.searchHint}>
              <span className={styles.hintIcon}>💡</span>
              <p>{t('tasks.start_typing')}</p>
            </div>
          )}

          {searchQuery !== '' && filteredTasks.length === 0 && (
            <div className={styles.noResults}>
              <span className={styles.noResultsIcon}>🔍</span>
              <p>{t('tasks.nothing_found')}</p>
              <small>{t('tasks.try_changing')}</small>
            </div>
          )}

          {filteredTasks.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <span>{t('tasks.found_tasks')}: {filteredTasks.length}</span>
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
                    
                                    {task && task.dueDate && (
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
