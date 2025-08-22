import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus } from '../../../../types';
import styles from './TodoCard.module.scss';

interface TodoCardProps {
  task: Task;
  boardName: string;
  columnName: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onTaskClick?: (taskId: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({
  task,
  boardName,
  columnName,
  onUpdateTask,
  onTaskClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleCardClick = () => {
    if (onTaskClick && typeof onTaskClick === 'function') {
      onTaskClick(task.id);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return '✓';
      case TaskStatus.IN_PROGRESS:
        return '▶';
      case TaskStatus.REVIEW:
        return '👀';
      case TaskStatus.TESTING:
        return '🧪';
      case TaskStatus.CANCELLED:
        return '❌';
      case TaskStatus.BLOCKED:
        return '🚫';
      case TaskStatus.ON_HOLD:
        return '⏸️';
      default:
        return '○';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'Завершено';
      case TaskStatus.IN_PROGRESS:
        return 'В работе';
      case TaskStatus.REVIEW:
        return 'На проверке';
      case TaskStatus.TESTING:
        return 'Тестирование';
      case TaskStatus.CANCELLED:
        return 'Отменено';
      case TaskStatus.BLOCKED:
        return 'Заблокировано';
      case TaskStatus.ON_HOLD:
        return 'На паузе';
      default:
        return 'К выполнению';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'Критический';
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      case 'urgent':
        return 'Срочно';
      default:
        return priority;
    }
  };



  const getDateLabel = () => {
    const today = new Date();
    const taskDate = task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'сегодня';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (taskDate.toDateString() === yesterday.toDateString()) {
      return 'вчера';
    }
    
    return taskDate.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (isEditing) {
    return (
      <div className={styles.cardEditing}>
        <div className={styles.editHeader}>
          <h4>Редактировать задачу</h4>
          <button className={styles.closeBtn} onClick={handleCancel}>
            ✕
          </button>
        </div>
        <input
          type="text"
          className={styles.editTitleInput}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Название задачи"
          autoFocus
        />
        <div className={styles.editActions}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Отмена
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.card} ${task.status === TaskStatus.COMPLETED ? styles.completed : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.cardTop}>
        <div className={styles.dragHandle}></div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.taskHeader}>
          <div className={styles.taskTitle}>
            <div className={styles.titlePart}>
              <span className={styles.titleLabel}>Доска:</span>
              <span className={styles.titleValue}>{boardName}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <div className={styles.titlePart}>
              <span className={styles.titleLabel}>Колонка:</span>
              <span className={styles.titleValue}>{columnName}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <div className={styles.titlePart}>
              <span className={styles.titleLabel}>ID:</span>
              <span className={styles.titleValue}>{task.id.slice(0, 6)}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <span className={styles.titleLabel}>Задача</span>
          </div>
          <div className={styles.taskDescription}>
            {task.title}
          </div>
        </div>
        
        <div className={styles.taskMeta}>
          <div className={styles.statusSection}>
            <div className={`${styles.statusIcon} ${styles[`status_${task.status.replace('-', '_')}`]}`}>
              {getStatusIcon(task.status)}
            </div>
            <span className={styles.statusText}>
              {getStatusText(task.status)}
            </span>
          </div>
          <span className={styles.separator}>|</span>
          <span className={`${styles.priorityText} ${styles[`priority_${task.priority}`]}`}>
            {getPriorityText(task.priority)}
          </span>
        </div>
        
        <div className={styles.taskFooter}>
          <div className={styles.footerLeft}>
            <span className={styles.dateLabel}>
              {getDateLabel()}
            </span>
          </div>
          
          <div className={styles.footerRight}>
            <span className={styles.commentCount}>
              💬 {task.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
