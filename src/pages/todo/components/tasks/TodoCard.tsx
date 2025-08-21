import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import styles from './TodoCard.module.scss';

interface TodoCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onTaskClick?: (taskId: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({
  task,
  onUpdate,
  onDelete,
  onToggleStatus,
  onStatusChange,
  onTaskClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  });

  const handleSave = () => {
    onUpdate(task.id, {
      ...editData,
      dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'К выполнению';
      case TaskStatus.IN_PROGRESS:
        return 'В работе';
      case TaskStatus.REVIEW:
        return 'На проверке';
      case TaskStatus.TESTING:
        return 'Тестирование';
      case TaskStatus.COMPLETED:
        return 'Завершено';
      case TaskStatus.CANCELLED:
        return 'Отменено';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'Срочно';
      case TaskPriority.HIGH:
        return 'Высокий';
      case TaskPriority.MEDIUM:
        return 'Средний';
      case TaskPriority.LOW:
        return 'Низкий';
      default:
        return priority;
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return '🔥';
      case TaskPriority.HIGH:
        return '🔴';
      case TaskPriority.MEDIUM:
        return '🟡';
      case TaskPriority.LOW:
        return '🟢';
      default:
        return '⚪';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit'
      });
    }
  };

  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== TaskStatus.COMPLETED;

  if (isEditing) {
    return (
      <div className={styles.cardEditing}>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className={styles.editTitleInput}
          placeholder="Task title..."
        />
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className={styles.editDescriptionInput}
          placeholder="Description..."
          rows={2}
        />
        <div className={styles.editActions}>
          <button onClick={handleSave} className={styles.saveBtn}>💾</button>
          <button onClick={handleCancel} className={styles.cancelBtn}>❌</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.card} ${isOverdue ? styles.overdue : ''}`}
      onClick={() => onTaskClick?.(task.id)}
      style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={() => onToggleStatus(task.id)}
            className={styles.taskCheckbox}
          />
        </div>
        
        <div className={styles.cardActions}>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.actionBtn}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className={styles.actionBtn}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.taskMeta}>
          <div className={styles.priority}>
            <span className={styles.priorityIcon}>{getPriorityIcon(task.priority)}</span>
            <span className={styles.priorityText}>{getPriorityLabel(task.priority)}</span>
          </div>
          
          {task.dueDate && (
            <div className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
              📅 {formatDate(task.dueDate)}
              {isOverdue && <span className={styles.overdueLabel}>Просрочено</span>}
            </div>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className={styles.tags}>
            {task.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className={styles.tag}>#{tag}</span>
            ))}
            {task.tags.length > 2 && (
              <span className={styles.moreTags}>+{task.tags.length - 2}</span>
            )}
          </div>
        )}

        {task.assigneeId && (
          <div className={styles.assignee}>
            👤 {task.assigneeId}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
