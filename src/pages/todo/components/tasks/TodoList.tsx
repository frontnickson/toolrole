import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import TodoTaskRow from './TodoTaskRow';
import styles from './TodoList.module.scss';

interface TodoListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTaskClick?: (taskId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onToggleStatus,
  onTaskClick
}) => {
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'dueDate' | 'status' | 'assignee'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Сортировка задач
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue: string | number, bValue: string | number;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'priority': {
        const priorityOrder = { 
          [TaskPriority.CRITICAL]: 5,
          [TaskPriority.URGENT]: 4, 
          [TaskPriority.HIGH]: 3, 
          [TaskPriority.MEDIUM]: 2, 
          [TaskPriority.LOW]: 1 
        };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      }
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'status': {
        const statusOrder = { 
          [TaskStatus.PLANNING]: 1, 
          [TaskStatus.IN_PROGRESS]: 2, 
          [TaskStatus.REVIEW]: 3, 
          [TaskStatus.TESTING]: 4, 
          [TaskStatus.COMPLETED]: 5,
          [TaskStatus.CANCELLED]: 6,
          [TaskStatus.BLOCKED]: 7,
          [TaskStatus.ON_HOLD]: 8
        };
        aValue = statusOrder[a.status] || 0;
        bValue = statusOrder[b.status] || 0;
        break;
      }
      case 'assignee':
        aValue = a.assigneeId || '';
        bValue = b.assigneeId || '';
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PLANNING:
        return styles.todoStatus;
      case TaskStatus.IN_PROGRESS:
        return styles.inProgressStatus;
      case TaskStatus.REVIEW:
        return styles.reviewStatus;
      case TaskStatus.TESTING:
        return styles.testingStatus;
      case TaskStatus.COMPLETED:
        return styles.completedStatus;
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return styles.criticalPriority;
      case TaskPriority.URGENT:
        return styles.urgentPriority;
      case TaskPriority.HIGH:
        return styles.highPriority;
      case TaskPriority.MEDIUM:
        return styles.mediumPriority;
      case TaskPriority.LOW:
        return styles.lowPriority;
      default:
        return '';
    }
  };

  return (
    <div className={styles.todoList}>
      {/* Заголовок и фильтры */}
      <div className={styles.listHeader}>
        <div className={styles.headerLeft}>
          <h2>Список задач ({sortedTasks.length})</h2>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Поиск по задачам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchIcon}>🔍</span>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.filters}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className={styles.filterSelect}
            >
              <option value="all">Все статусы</option>
              <option value={TaskStatus.PLANNING}>К выполнению</option>
              <option value={TaskStatus.IN_PROGRESS}>В работе</option>
              <option value={TaskStatus.REVIEW}>На проверке</option>
              <option value={TaskStatus.TESTING}>Тестирование</option>
              <option value={TaskStatus.COMPLETED}>Завершено</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className={styles.filterSelect}
            >
              <option value="all">Все приоритеты</option>
              <option value={TaskPriority.URGENT}>Срочно</option>
              <option value={TaskPriority.HIGH}>Высокий</option>
              <option value={TaskPriority.MEDIUM}>Средний</option>
              <option value={TaskPriority.LOW}>Низкий</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблица задач */}
      <div className={styles.tableContainer}>
        <table className={styles.tasksTable}>
          <thead>
            <tr>
              <th className={styles.checkboxCol}>
                <input type="checkbox" className={styles.selectAllCheckbox} />
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.titleCol}`}
                onClick={() => handleSort('title')}
              >
                Название {getSortIcon('title')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.statusCol}`}
                onClick={() => handleSort('status')}
              >
                Статус {getSortIcon('status')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.priorityCol}`}
                onClick={() => handleSort('priority')}
              >
                Приоритет {getSortIcon('priority')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.assigneeCol}`}
                onClick={() => handleSort('assignee')}
              >
                Исполнитель {getSortIcon('assignee')}
              </th>
              <th 
                className={`${styles.sortableHeader} ${styles.dueDateCol}`}
                onClick={() => handleSort('dueDate')}
              >
                Срок {getSortIcon('dueDate')}
              </th>
              <th className={styles.tagsCol}>Теги</th>
              <th className={styles.actionsCol}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <span className={styles.emptyIcon}>📝</span>
                    <h3>Нет задач</h3>
                    <p>Создайте первую задачу или измените фильтры</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <TodoTaskRow
                  key={task.id}
                  task={task}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                  onToggleStatus={onToggleStatus}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  onTaskClick={onTaskClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
