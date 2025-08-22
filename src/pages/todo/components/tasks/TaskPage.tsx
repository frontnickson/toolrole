import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { Task, Comment, Subtask, Attachment, Activity, TaskTag } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import { updateTask, deleteTask, moveTaskByStatus } from '../../../../store/slices/boardSlice';
import type { RootState } from '../../../../store';
import CustomSelect from './CustomSelect';
import styles from './TaskPage.module.scss';

const TaskPage: React.FC = () => {
  
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentBoard } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [task, setTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});

  // Опции для статуса
  const statusOptions = [
    { value: TaskStatus.PLANNING, label: 'К выполнению', color: '#FF6B6B' },
    { value: TaskStatus.IN_PROGRESS, label: 'В работе', color: '#4ECDC4' },
    { value: TaskStatus.REVIEW, label: 'На проверке', color: '#FFA726' },
    { value: TaskStatus.COMPLETED, label: 'Завершено', color: '#45B7D1' },
    { value: TaskStatus.TESTING, label: 'Тестирование', color: '#AB47BC' },
    { value: TaskStatus.CANCELLED, label: 'Отменено', color: '#95A5A6' },
    { value: TaskStatus.BLOCKED, label: 'Заблокировано', color: '#E74C3C' },
    { value: TaskStatus.ON_HOLD, label: 'На паузе', color: '#95A5A6' }
  ];

  // Опции для приоритета
  const priorityOptions = [
    { value: TaskPriority.LOW, label: 'Низкий', color: '#27AE60' },
    { value: TaskPriority.MEDIUM, label: 'Средний', color: '#F39C12' },
    { value: TaskPriority.HIGH, label: 'Высокий', color: '#E74C3C' },
    { value: TaskPriority.URGENT, label: 'Срочно', color: '#8E44AD' },
    { value: TaskPriority.CRITICAL, label: 'Критический', color: '#8B0000' }
  ];

  // Находим задачу по ID из текущей доски
  useEffect(() => {
    console.log('=== TaskPage useEffect ===');
    console.log('taskId:', taskId);
    console.log('currentBoard:', currentBoard);
    console.log('currentBoard?.columns:', currentBoard?.columns);
    
    if (taskId && currentBoard) {
      const foundTask = currentBoard.columns.flatMap(col => col.tasks).find(t => t.id === taskId);
      console.log('foundTask:', foundTask);
      
      if (foundTask) {
        setTask(foundTask);
        setEditData({
          title: foundTask.title,
          description: foundTask.description,
          status: foundTask.status,
          priority: foundTask.priority,
          dueDate: foundTask.dueDate,
          tags: foundTask.tags
        });
      } else {
        console.log('Задача не найдена!');
      }
    }
  }, [taskId, currentBoard]);

  // Обработчик добавления комментария
  const handleAddComment = () => {
    if (!task || !newComment.trim() || !currentBoard) return;

    const comment: Comment = {
      id: Date.now().toString(),
      taskId: task.id,
      boardId: task.boardId,
      authorId: currentUser?.id?.toString() || 'unknown',
      content: newComment.trim(),
      mentions: [],
      attachments: [],
      isEdited: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      replies: [],
      likes: [],
      reactions: [],
      isPinned: false,
      isPrivate: false
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, comment]
    };

    dispatch(updateTask({
      boardId: currentBoard.id,
      taskId: task.id,
      updates: { comments: updatedTask.comments }
    }));
    
    setNewComment('');
  };

  // Обработчик сохранения изменений
  const handleSaveChanges = () => {
    if (!task || !currentBoard) return;
    
    // Если изменился статус, используем moveTaskByStatus
    if (editData.status && editData.status !== task.status) {
      dispatch(moveTaskByStatus({
        boardId: currentBoard.id,
        taskId: task.id,
        newStatus: editData.status
      }));
      
      // Показываем уведомление о перемещении
      const statusText = {
        [TaskStatus.PLANNING]: 'К выполнению',
        [TaskStatus.IN_PROGRESS]: 'В работе',
        [TaskStatus.REVIEW]: 'На проверке',
        [TaskStatus.COMPLETED]: 'Завершено',
        [TaskStatus.TESTING]: 'Тестирование',
        [TaskStatus.CANCELLED]: 'Отменено',
        [TaskStatus.BLOCKED]: 'Заблокировано',
        [TaskStatus.ON_HOLD]: 'На паузе'
      }[editData.status] || editData.status;
      
      alert(`Задача перемещена в колонку: ${statusText}`);
      
      // Обновляем остальные поля через updateTask
      const otherUpdates = { ...editData };
      delete otherUpdates.status;
      
      if (Object.keys(otherUpdates).length > 0) {
        dispatch(updateTask({
          boardId: currentBoard.id,
          taskId: task.id,
          updates: otherUpdates
        }));
      }
    } else {
      // Если статус не изменился, используем обычный updateTask
      dispatch(updateTask({
        boardId: currentBoard.id,
        taskId: task.id,
        updates: editData
      }));
    }
    
    setIsEditing(false);
  };

  // Обработчик удаления задачи
  const handleDeleteTask = () => {
    if (!task || !currentBoard) return;
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask({
        boardId: currentBoard.id,
        taskId: task.id
      }));
      navigate('/todo');
    }
  };

  // Обработчик изменения тегов
  const handleTagsChange = (tags: string[]) => {
    if (!task || !currentBoard) return;
    const taskTags: TaskTag[] = tags.map(tag => ({
      id: Date.now().toString() + Math.random(),
      name: tag,
      color: '#007bff',
      description: '',
      createdAt: Date.now(),
      createdBy: currentUser?.id?.toString() || 'unknown'
    }));
    dispatch(updateTask({
      boardId: currentBoard.id,
      taskId: task.id,
      updates: { tags: taskTags }
    }));
  };

  // Обработчик быстрого изменения даты
  const handleQuickDateChange = (newDate: string) => {
    if (!task || !currentBoard) return;
    
    const timestamp = newDate ? new Date(newDate).getTime() : undefined;
    
    dispatch(updateTask({
      boardId: currentBoard.id,
      taskId: task.id,
      updates: { dueDate: timestamp }
    }));
    
    setIsChangingDate(false);
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
      case TaskStatus.PLANNING: return '#FF6B6B';
      case TaskStatus.IN_PROGRESS: return '#4ECDC4';
      case TaskStatus.REVIEW: return '#FFA726';
      case TaskStatus.TESTING: return '#AB47BC';
      case TaskStatus.COMPLETED: return '#45B7D1';
      case TaskStatus.CANCELLED: return '#95A5A6';
      case TaskStatus.BLOCKED: return '#E74C3C';
      case TaskStatus.ON_HOLD: return '#95A5A6';
      default: return '#95A5A6';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL: return '#8B0000';
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
                    <label>Статус:</label>
                    <CustomSelect
                      options={statusOptions}
                      value={editData.status || task.status}
                      onChange={(value) => setEditData({ ...editData, status: value as TaskStatus })}
                      placeholder="Выберите статус"
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Приоритет:</label>
                    <CustomSelect
                      options={priorityOptions}
                      value={editData.priority || TaskPriority.MEDIUM}
                      onChange={(value) => setEditData({ ...editData, priority: value as TaskPriority })}
                      placeholder="Выберите приоритет"
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Дата выполнения:</label>
                    <input
                      type="date"
                      value={editData.dueDate ? new Date(editData.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined 
                      })}
                    />
                    <small className={styles.fieldHint}>Измените дату для отображения в календаре на другой день</small>
                  </div>
                  
                  <div className={styles.field}>
                    <label>Теги:</label>
                    <input
                      type="text"
                      value={editData.tags?.map((tag: TaskTag) => tag.name).join(', ') || ''}
                      onChange={(e) => handleTagsChange(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
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
                      {task.status === TaskStatus.PLANNING && 'Планирование'}
                      {task.status === TaskStatus.IN_PROGRESS && 'В работе'}
                      {task.status === TaskStatus.REVIEW && 'На проверке'}
                      {task.status === TaskStatus.TESTING && 'Тестирование'}
                      {task.status === TaskStatus.COMPLETED && 'Завершено'}
                      {task.status === TaskStatus.CANCELLED && 'Отменено'}
                      {task.status === TaskStatus.BLOCKED && 'Заблокировано'}
                      {task.status === TaskStatus.ON_HOLD && 'На паузе'}
                    </span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.label}>Приоритет:</span>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority === TaskPriority.CRITICAL && 'Критический'}
                      {task.priority === TaskPriority.LOW && 'Низкий'}
                      {task.priority === TaskPriority.MEDIUM && 'Средний'}
                      {task.priority === TaskPriority.HIGH && 'Высокий'}
                      {task.priority === TaskPriority.URGENT && 'Срочно'}
                    </span>
                  </div>
                  
                  {task.dueDate && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>Дата выполнения:</span>
                      {isChangingDate ? (
                        <div className={styles.quickDateChange}>
                          <input
                            type="date"
                            defaultValue={new Date(task.dueDate).toISOString().split('T')[0]}
                            onBlur={(e) => handleQuickDateChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleQuickDateChange(e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                setIsChangingDate(false);
                              }
                            }}
                            className={styles.quickDateInput}
                            autoFocus
                          />
                          <button 
                            className={styles.cancelDateBtn}
                            onClick={() => setIsChangingDate(false)}
                            title="Отменить"
                          >
                            ❌
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className={styles.dueDate}>
                            {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                          </span>
                          <button 
                            className={styles.changeDateBtn}
                            onClick={() => setIsChangingDate(true)}
                            title="Изменить дату"
                          >
                            ✏️
                          </button>
                          <small className={styles.dateHint}>Нажмите ✏️ для быстрого изменения</small>
                        </>
                      )}
                    </div>
                  )}
                  
                  {task.tags.length > 0 && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>Теги:</span>
                      <div className={styles.tags}>
                        {task.tags.map((tag: TaskTag, index: number) => (
                          <span key={index} className={styles.tag}>
                            {tag.name}
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
                {task.subtasks.map((subtask: Subtask) => (
                  <div key={subtask.id} className={styles.subtask}>
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() => {
                        if (!currentBoard) return;
                        const updatedSubtasks = task.subtasks.map(s =>
                          s.id === subtask.id 
                            ? { ...s, isCompleted: !s.isCompleted }
                            : s
                        );
                        dispatch(updateTask({
                          boardId: currentBoard.id,
                          taskId: task.id,
                          updates: { subtasks: updatedSubtasks }
                        }));
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
                {task.attachments.map((attachment: Attachment) => (
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
              {task.comments.map((comment: Comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>Пользователь</span>
                    <span className={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
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
              <CustomSelect
                options={statusOptions}
                value={task.status}
                onChange={(value) => {
                  const newStatus = value as TaskStatus;
                  if (newStatus !== task.status) {
                    dispatch(moveTaskByStatus({
                      boardId: currentBoard?.id || '',
                      taskId: task.id,
                      newStatus: newStatus
                    }));
                  }
                  setEditData(prev => ({ ...prev, status: newStatus }));
                }}
                placeholder="Выберите статус"
              />
            </div>
            
            <div className={styles.actionGroup}>
              <label>Изменить приоритет:</label>
              <CustomSelect
                options={priorityOptions}
                value={task.priority}
                onChange={(value) => {
                  const newPriority = value as TaskPriority;
                  if (newPriority !== task.priority && currentBoard) {
                    dispatch(updateTask({
                      boardId: currentBoard.id,
                      taskId: task.id,
                      updates: { priority: newPriority }
                    }));
                  }
                }}
                placeholder="Выберите приоритет"
              />
            </div>
          </div>

          {/* Активность */}
          {task.activities && task.activities.length > 0 && (
            <div className={styles.activitySection}>
              <h3>Активность</h3>
              {task.activities.map((activity: Activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityAction}>
                    {activity.action}
                  </span>
                  <span className={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
