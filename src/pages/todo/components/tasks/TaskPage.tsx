import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Task, Comment, Activity, Attachment, Subtask } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import styles from './TaskPage.module.scss';

interface TaskPageProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskPage: React.FC<TaskPageProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask
}) => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});

  // Находим задачу по ID
  useEffect(() => {
    if (taskId && tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        setEditData({
          title: foundTask.title,
          description: foundTask.description,
          priority: foundTask.priority,
          dueDate: foundTask.dueDate,
          tags: foundTask.tags
        });
      }
    }
  }, [taskId, tasks]);

  // Обработчик добавления комментария
  const handleAddComment = () => {
    if (!task || !newComment.trim()) return;

    const comment: Comment = {
      id: `comment_${Date.now()}`,
      taskId: task.id,
      authorId: 'user1', // В реальном приложении брать из контекста пользователя
      content: newComment.trim(),
      mentions: [],
      attachments: [],
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
      likes: []
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, comment]
    };

    onUpdateTask(task.id, { comments: updatedTask.comments });
    setNewComment('');
  };

  // Обработчик изменения статуса
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!task) return;
    onUpdateTask(task.id, { status: newStatus });
  };

  // Обработчик изменения приоритета
  const handlePriorityChange = (newPriority: TaskPriority) => {
    if (!task) return;
    onUpdateTask(task.id, { priority: newPriority });
  };

  // Обработчик сохранения изменений
  const handleSaveChanges = () => {
    if (!task) return;
    onUpdateTask(task.id, editData);
    setIsEditing(false);
  };

  // Обработчик удаления задачи
  const handleDeleteTask = () => {
    if (!task) return;
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDeleteTask(task.id);
      navigate('/todo');
    }
  };

  // Обработчик изменения тегов
  const handleTagsChange = (tags: string[]) => {
    if (!task) return;
    onUpdateTask(task.id, { tags });
  };

  // Обработчик изменения даты выполнения
  const handleDueDateChange = (dueDate: Date | undefined) => {
    if (!task) return;
    onUpdateTask(task.id, { dueDate });
  };

  if (!task) {
    return (
      <div className={styles.taskPage}>
        <div className={styles.loading}>
          <h2>Загрузка задачи...</h2>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO: return '#FF6B6B';
      case TaskStatus.IN_PROGRESS: return '#4ECDC4';
      case TaskStatus.REVIEW: return '#FFA726';
      case TaskStatus.TESTING: return '#AB47BC';
      case TaskStatus.COMPLETED: return '#45B7D1';
      case TaskStatus.CANCELLED: return '#95A5A6';
      default: return '#95A5A6';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return '#27AE60';
      case TaskPriority.MEDIUM: return '#F39C12';
      case TaskPriority.HIGH: return '#E74C3C';
      case TaskPriority.URGENT: return '#8E44AD';
      default: return '#95A5A6';
    }
  };

  return (
    <div className={styles.taskPage}>
      {/* Заголовок страницы */}
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/todo')}
        >
          ← Назад к доске
        </button>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Отменить' : 'Редактировать'}
          </button>
          
          {isEditing && (
            <button 
              className={styles.saveButton}
              onClick={handleSaveChanges}
            >
              Сохранить
            </button>
          )}
          
          <button 
            className={styles.deleteButton}
            onClick={handleDeleteTask}
          >
            Удалить
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Основная информация о задаче */}
          <div className={styles.taskInfo}>
            {isEditing ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className={styles.titleInput}
                  placeholder="Название задачи"
                />
                
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className={styles.descriptionInput}
                  placeholder="Описание задачи"
                  rows={5}
                />
                
                <div className={styles.editFields}>
                  <div className={styles.field}>
                    <label>Приоритет:</label>
                    <select
                      value={editData.priority || TaskPriority.MEDIUM}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value as TaskPriority })}
                    >
                      <option value={TaskPriority.LOW}>Низкий</option>
                      <option value={TaskPriority.MEDIUM}>Средний</option>
                      <option value={TaskPriority.HIGH}>Высокий</option>
                      <option value={TaskPriority.URGENT}>Срочно</option>
                    </select>
                  </div>
                  
                  <div className={styles.field}>
                    <label>Дата выполнения:</label>
                    <input
                      type="date"
                      value={editData.dueDate ? editData.dueDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        dueDate: e.target.value ? new Date(e.target.value) : undefined 
                      })}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Теги:</label>
                    <input
                      type="text"
                      value={editData.tags?.join(', ') || ''}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) 
                      })}
                      placeholder="Теги через запятую"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h1 className={styles.taskTitle}>{task.title}</h1>
                <p className={styles.taskDescription}>{task.description}</p>
                
                <div className={styles.taskMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.label}>Статус:</span>
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status === TaskStatus.TODO && 'К выполнению'}
                      {task.status === TaskStatus.IN_PROGRESS && 'В работе'}
                      {task.status === TaskStatus.REVIEW && 'На проверке'}
                      {task.status === TaskStatus.TESTING && 'Тестирование'}
                      {task.status === TaskStatus.COMPLETED && 'Завершено'}
                      {task.status === TaskStatus.CANCELLED && 'Отменено'}
                    </span>
                  </div>
                  
                  <div className={styles.metaItem}>
                    <span className={styles.label}>Приоритет:</span>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority === TaskPriority.LOW && 'Низкий'}
                      {task.priority === TaskPriority.MEDIUM && 'Средний'}
                      {task.priority === TaskPriority.HIGH && 'Высокий'}
                      {task.priority === TaskPriority.URGENT && 'Срочно'}
                    </span>
                  </div>
                  
                  {task.dueDate && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>Дата выполнения:</span>
                      <span className={styles.dueDate}>
                        {task.dueDate.toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}
                  
                  {task.tags.length > 0 && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>Теги:</span>
                      <div className={styles.tags}>
                        {task.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Подзадачи */}
          {task.subtasks.length > 0 && (
            <div className={styles.subtasks}>
              <h3>Подзадачи</h3>
              <div className={styles.subtasksList}>
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className={styles.subtask}>
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() => {
                        const updatedSubtasks = task.subtasks.map(s =>
                          s.id === subtask.id 
                            ? { ...s, isCompleted: !s.isCompleted }
                            : s
                        );
                        onUpdateTask(task.id, { subtasks: updatedSubtasks });
                      }}
                    />
                    <span className={subtask.isCompleted ? styles.completed : ''}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Вложения */}
          {task.attachments.length > 0 && (
            <div className={styles.attachments}>
              <h3>Вложения</h3>
              <div className={styles.attachmentsList}>
                {task.attachments.map((attachment) => (
                  <div key={attachment.id} className={styles.attachment}>
                    <span className={styles.attachmentIcon}>📎</span>
                    <span className={styles.attachmentName}>{attachment.fileName}</span>
                    <span className={styles.attachmentSize}>
                      {(attachment.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Комментарии */}
          <div className={styles.comments}>
            <h3>Комментарии ({task.comments.length})</h3>
            
            <div className={styles.addComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Добавить комментарий..."
                rows={3}
              />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={styles.addCommentButton}
              >
                Добавить комментарий
              </button>
            </div>
            
            <div className={styles.commentsList}>
              {task.comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>Пользователь</span>
                    <span className={styles.commentDate}>
                      {comment.createdAt.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className={styles.commentContent}>
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className={styles.sidebar}>
          {/* Быстрые действия */}
          <div className={styles.quickActions}>
            <h3>Быстрые действия</h3>
            
            <div className={styles.actionGroup}>
              <label>Изменить статус:</label>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              >
                <option value={TaskStatus.TODO}>К выполнению</option>
                <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                <option value={TaskStatus.REVIEW}>На проверке</option>
                <option value={TaskStatus.TESTING}>Тестирование</option>
                <option value={TaskStatus.COMPLETED}>Завершено</option>
                <option value={TaskStatus.CANCELLED}>Отменено</option>
              </select>
            </div>
            
            <div className={styles.actionGroup}>
              <label>Изменить приоритет:</label>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
              >
                <option value={TaskPriority.LOW}>Низкий</option>
                <option value={TaskPriority.MEDIUM}>Средний</option>
                <option value={TaskPriority.HIGH}>Высокий</option>
                <option value={TaskPriority.URGENT}>Срочно</option>
              </select>
            </div>
          </div>

          {/* Активность */}
          <div className={styles.activity}>
            <h3>Активность</h3>
            <div className={styles.activityList}>
              {task.activity.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityIcon}>📝</span>
                  <div className={styles.activityContent}>
                    <span className={styles.activityAction}>
                      {activity.action === 'created' && 'Задача создана'}
                      {activity.action === 'updated' && 'Задача обновлена'}
                      {activity.action === 'status_changed' && 'Статус изменен'}
                      {activity.action === 'assigned' && 'Назначена'}
                      {activity.action === 'commented' && 'Добавлен комментарий'}
                      {activity.action === 'attachment_added' && 'Добавлено вложение'}
                      {activity.action === 'due_date_changed' && 'Изменена дата выполнения'}
                      {activity.action === 'priority_changed' && 'Изменен приоритет'}
                      {activity.action === 'archived' && 'Задача архивирована'}
                      {activity.action === 'restored' && 'Задача восстановлена'}
                    </span>
                    <span className={styles.activityTime}>
                      {activity.timestamp.toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
