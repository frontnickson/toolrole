import React, { useState } from 'react';
import { TodoStatus } from '../../types/index';
import type { TodoItem as TodoItemType } from '../../types/index';
import styles from './TodoItem.module.scss';

interface TodoItemProps {
  todo: TodoItemType;
  isEditing: boolean;
  onStartEdit: (id: number) => void;
  onStopEdit: () => void;
  onUpdate: (id: number, updates: Partial<TodoItemType>) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

const TodoItemComponent: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  onStartEdit,
  onStopEdit,
  onUpdate,
  onDelete,
  onToggleStatus
}) => {
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate,
    tags: todo.tags
  });

  const handleSave = () => {
    onUpdate(todo.id, editData);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate,
      tags: todo.tags
    });
    onStopEdit();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return '';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isOverdue = todo.dueDate && new Date() > todo.dueDate && todo.status !== TodoStatus.COMPLETED;

  if (isEditing) {
    return (
      <div className={`${styles.todoItem} ${styles.editing}`}>
        <div className={styles.editForm}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className={styles.editTitle}
            placeholder="Название задачи"
          />
          
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className={styles.editDescription}
            placeholder="Описание задачи"
            rows={2}
          />
          
          <div className={styles.editControls}>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value as 'low' | 'medium' | 'high' })}
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            
            <input
              type="date"
              value={editData.dueDate ? editData.dueDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEditData({ 
                ...editData, 
                dueDate: e.target.value ? new Date(e.target.value) : undefined 
              })}
            />
          </div>
          
          <div className={styles.editActions}>
            <button onClick={handleSave} className={styles.saveBtn}>
              Сохранить
            </button>
            <button onClick={handleCancel} className={styles.cancelBtn}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.todoItem} ${isOverdue ? styles.overdue : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.titleRow}>
          <h4 className={styles.title}>{todo.title}</h4>
          <div className={styles.actions}>
            <button
              onClick={() => onStartEdit(todo.id)}
              className={styles.editBtn}
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className={styles.deleteBtn}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className={styles.meta}>
          <span className={`${styles.priority} ${getPriorityColor(todo.priority)}`}>
            {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'} {todo.priority}
          </span>
          
          {todo.dueDate && (
            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
              📅 {formatDate(todo.dueDate)}
              {isOverdue && <span className={styles.overdueLabel}>Просрочено</span>}
            </span>
          )}
        </div>
      </div>
      
      {todo.description && (
        <p className={styles.description}>{todo.description}</p>
      )}
      
      {todo.tags.length > 0 && (
        <div className={styles.tags}>
          {todo.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className={styles.itemFooter}>
        <span className={styles.createdAt}>
          Создано: {formatDate(todo.createdAt)}
        </span>
        
        <button
          onClick={() => onToggleStatus(todo.id)}
          className={`${styles.statusToggle} ${
            todo.status === TodoStatus.COMPLETED ? styles.completed : ''
          }`}
        >
          {todo.status === TodoStatus.COMPLETED ? '✅ Завершено' : '⭕ Отметить выполненным'}
        </button>
      </div>
    </div>
  );
};

export default TodoItemComponent;
