import React, { useState } from 'react';
import type { Task } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import styles from './TodoTaskRow.module.scss';

interface TodoTaskRowProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  getStatusColor: (status: TaskStatus) => string;
  getPriorityColor: (priority: TaskPriority) => string;
  onTaskClick?: (taskId: string) => void;
}

const TodoTaskRow: React.FC<TodoTaskRowProps> = ({
  task,
  onUpdate,
  onDelete,
  onToggleStatus,
  getStatusColor,
  getPriorityColor,
  onTaskClick
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });

  const handleSave = () => {
    onUpdate(task.id, {
      ...editData,
      dueDate: editData.dueDate ? new Date(editData.dueDate).getTime() : undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PLANNING:
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
      case TaskStatus.BLOCKED:
        return 'Заблокировано';
      case TaskStatus.ON_HOLD:
        return 'Приостановлено';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return 'Критично';
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
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
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate) && task.status !== TaskStatus.COMPLETED;

  if (isEditing) {
    return (
      <tr className={styles.editingRow}>
        <td className={styles.checkboxCol}>
          <input
            type="checkbox"
            checked={task.status === TaskStatus.COMPLETED}
            onChange={() => onToggleStatus(task.id)}
          />
        </td>
        <td className={styles.titleCol}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className={styles.editInput}
          />
        </td>
        <td className={styles.statusCol}>
          <span className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
        </td>
        <td className={styles.priorityCol}>
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value as TaskPriority })}
            className={styles.editSelect}
          >
            <option value={TaskPriority.LOW}>Низкий</option>
            <option value={TaskPriority.MEDIUM}>Средний</option>
            <option value={TaskPriority.HIGH}>Высокий</option>
            <option value={TaskPriority.URGENT}>Срочно</option>
          </select>
        </td>
        <td className={styles.assigneeCol}>
          <span className={styles.assignee}>👤 {task.assigneeId || 'Не назначен'}</span>
        </td>
        <td className={styles.dueDateCol}>
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className={styles.editInput}
          />
        </td>
        <td className={styles.tagsCol}>
          <div className={styles.tags}>
            {task.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className={styles.tag}>#{tag.name}</span>
            ))}
            {task.tags.length > 2 && (
              <span className={styles.moreTags}>+{task.tags.length - 2}</span>
            )}
          </div>
        </td>
        <td className={styles.actionsCol}>
          <div className={styles.editActions}>
            <button onClick={handleSave} className={styles.saveBtn}>💾</button>
            <button onClick={handleCancel} className={styles.cancelBtn}>❌</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`${styles.taskRow} ${isOverdue ? styles.overdue : ''}`}>
      <td className={styles.checkboxCol}>
        <input
          type="checkbox"
          checked={task.status === TaskStatus.COMPLETED}
          onChange={() => onToggleStatus(task.id)}
          className={styles.taskCheckbox}
        />
      </td>
      <td className={styles.titleCol}>
        <div 
          className={styles.taskTitle}
          onClick={() => onTaskClick?.(task.id)}
          style={{ cursor: onTaskClick ? 'pointer' : 'default' }}
        >
          <span className={styles.titleText}>{task.title}</span>
          {task.description && (
            <span className={styles.description}>{task.description}</span>
          )}
        </div>
      </td>
      <td className={styles.statusCol}>
        <span className={`${styles.statusBadge} ${getStatusColor(task.status)}`}>
          {getStatusLabel(task.status)}
        </span>
      </td>
      <td className={styles.priorityCol}>
        <span className={`${styles.priorityBadge} ${getPriorityColor(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </td>
      <td className={styles.assigneeCol}>
        <span className={styles.assignee}>
          👤 {task.assigneeId || 'Не назначен'}
        </span>
      </td>
      <td className={styles.dueDateCol}>
        {task.dueDate ? (
          <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
            📅 {formatDate(task.dueDate)}
            {isOverdue && <span className={styles.overdueLabel}>Просрочено</span>}
          </span>
        ) : (
          <span className={styles.noDueDate}>—</span>
        )}
      </td>
      <td className={styles.tagsCol}>
        <div className={styles.tags}>
          {task.tags.slice(0, 2).map((tag, index) => (
            <span key={index} className={styles.tag}>#{tag.name}</span>
          ))}
          {task.tags.length > 2 && (
            <span className={styles.moreTags}>+{task.tags.length - 2}</span>
          )}
        </div>
      </td>
      <td className={styles.actionsCol}>
        <div className={styles.actions}>
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
      </td>
    </tr>
  );
};

export default TodoTaskRow;
