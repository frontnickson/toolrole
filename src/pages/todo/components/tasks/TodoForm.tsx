import React, { useState } from 'react';
import type { TodoFormData } from '../../types/index';
import styles from './TodoForm.module.scss';

interface TodoFormProps {
  onAddTodo: (todo: TodoFormData) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: undefined,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTodo(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: undefined,
        tags: []
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={styles.todoForm}>
      <h3>Добавить задачу</h3>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Название *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Введите название задачи"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Опишите задачу подробнее"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Срок выполнения</label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              dueDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags">Теги</label>
          <div className={styles.tagInput}>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите тег и нажмите Enter"
            />
            <button 
              type="button" 
              onClick={addTag}
              className={styles.addTagBtn}
            >
              +
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className={styles.tags}>
              {formData.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={styles.removeTag}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Добавить задачу
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
