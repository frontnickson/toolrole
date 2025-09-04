import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus } from '../../../../types';
import styles from './TodoCard.module.scss';
import { useTranslation } from '../../../../utils/translations';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';

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
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation(currentUser?.language || 'ru');
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

  // Получаем переведенное название задачи
  const getTranslatedTaskTitle = (task: Task): string => {
    // Проверяем, является ли это тестовой задачей
    if (task.id === 'test-task-1') {
      return t('tasks.test_task_1');
    }
    if (task.id === 'test-task-2') {
      return t('tasks.test_task_2');
    }
    
    return task.title; // Обычные задачи не переводим
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return t('tasks.completed');
      case TaskStatus.IN_PROGRESS:
        return t('tasks.in_progress');
      case TaskStatus.REVIEW:
        return t('tasks.review');
      case TaskStatus.TESTING:
        return t('tasks.testing');
      case TaskStatus.CANCELLED:
        return t('tasks.cancelled');
      case TaskStatus.BLOCKED:
        return t('tasks.blocked');
      case TaskStatus.ON_HOLD:
        return t('tasks.on_hold');
      default:
        return t('tasks.to_do');
    }
  };

  const getPriorityText = (priority: string) => {
    if (!priority) return t('tasks.not_specified');
    
    switch (priority) {
      case 'critical':
        return t('tasks.critical');
      case 'high':
        return t('tasks.high');
      case 'medium':
        return t('tasks.medium');
      case 'low':
        return t('tasks.low');
      case 'urgent':
        return t('tasks.urgent');
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

  const getCommentText = (count: number) => {
    if (count === 0) return 'комментариев';
    if (count === 1) return 'комментарий';
    if (count < 5) return 'комментария';
    return 'комментариев';
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

  // Логируем рендер компонента для отладки
  // console.log('TodoCard render:', {
  //   task,
  //   isExpanded,
  //   isEditing,
  //   currentBoard,
  //   column
  // });

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
              <span className={styles.titleLabel}>{t('tasks.board_label')}</span>
              <span className={styles.titleValue}>{boardName}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <div className={styles.titlePart}>
              <span className={styles.titleLabel}>{t('tasks.column_label')}</span>
              <span className={styles.titleValue}>{columnName}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <div className={styles.titlePart}>
              <span className={styles.titleLabel}>ID:</span>
              <span className={styles.titleValue}>{task.id.slice(0, 6)}</span>
            </div>
            <span className={styles.titleSeparator}>|</span>
            <span className={styles.titleLabel}>{t('tasks.task_label')}</span>
            {/* Компактное отображение комментариев в заголовке */}
            {(task.comments?.length || 0) > 0 && (
              <>
                <span className={styles.titleSeparator}>|</span>
                <div className={styles.titlePart}>
                  <span className={styles.titleLabel}>💬</span>
                  <span className={`${styles.titleValue} ${styles.commentsCount}`}>{task.comments?.length || 0}</span>
                </div>
              </>
            )}
          </div>
          <div className={styles.taskDescription}>
            {getTranslatedTaskTitle(task)}
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
              💬 {task.comments?.length || 0} {getCommentText(task.comments?.length || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
