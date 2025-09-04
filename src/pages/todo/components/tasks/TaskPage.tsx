import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { Task, Comment, Subtask, Attachment, Activity, TaskTag } from '../../../../types';
import { TaskStatus, TaskPriority } from '../../../../types';
import { updateTask, deleteTask, moveTaskByStatus } from '../../../../store/slices/boardSlice';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import CustomSelect from './CustomSelect';
import styles from './TaskPage.module.scss';

interface TaskPageProps {
  taskId: string;
  onClose: () => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ taskId, onClose }) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentBoard } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');
  
  const [task, setTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);
  const [editData, setEditData] = useState<Partial<Task>>({});

  // Функция для получения доступных статусов в зависимости от текущего статуса
  const getAvailableStatusOptions = (currentStatus: TaskStatus) => {
    const allStatusOptions = [
      { value: TaskStatus.PLANNING, label: t('tasks.to_do'), color: '#FF6B6B' },
      { value: TaskStatus.IN_PROGRESS, label: t('tasks.in_progress'), color: '#4ECDC4' },
      { value: TaskStatus.REVIEW, label: t('tasks.review'), color: '#FFA726' },
      { value: TaskStatus.COMPLETED, label: t('tasks.completed'), color: '#45B7D1' },
      { value: TaskStatus.TESTING, label: t('tasks.testing'), color: '#AB47BC' },
      { value: TaskStatus.CANCELLED, label: t('tasks.cancelled'), color: '#95A5A6' },
      { value: TaskStatus.BLOCKED, label: t('tasks.blocked'), color: '#E74C3C' },
      { value: TaskStatus.ON_HOLD, label: t('tasks.on_hold'), color: '#95A5A6' },
      { value: TaskStatus.OVERDUE, label: 'Просрочено', color: '#DC2626' }
    ];

    // Ограничиваем переходы между статусами
    switch (currentStatus) {
      case TaskStatus.PLANNING:
        // Из "К выполнению" можно перейти только в "В работе"
        return allStatusOptions.filter(option => 
          option.value === TaskStatus.IN_PROGRESS || option.value === currentStatus
        );
      case TaskStatus.IN_PROGRESS:
        // Из "В работе" можно перейти только в "На проверке"
        return allStatusOptions.filter(option => 
          option.value === TaskStatus.REVIEW || option.value === currentStatus
        );
      case TaskStatus.REVIEW:
        // Из "На проверке" можно перейти только в "В работе" или "Завершено"
        return allStatusOptions.filter(option => 
          option.value === TaskStatus.IN_PROGRESS || 
          option.value === TaskStatus.COMPLETED || 
          option.value === currentStatus
        );
      case TaskStatus.COMPLETED:
        // Из "Завершено" нельзя перейти никуда
        return allStatusOptions.filter(option => option.value === currentStatus);
      case TaskStatus.OVERDUE:
        // Из "Просрочено" можно перейти только в "В работе"
        return allStatusOptions.filter(option => 
          option.value === TaskStatus.IN_PROGRESS || option.value === currentStatus
        );
      default:
        // Для остальных статусов возвращаем все опции
        return allStatusOptions;
    }
  };

  // Получаем доступные опции статуса
  const statusOptions = getAvailableStatusOptions(task?.status || TaskStatus.PLANNING);

  // Опции для приоритета
  const priorityOptions = [
    { value: TaskPriority.LOW, label: t('tasks.low'), color: '#27AE60' },
    { value: TaskPriority.MEDIUM, label: t('tasks.medium'), color: '#F39C12' },
    { value: TaskPriority.HIGH, label: t('tasks.high'), color: '#E74C3C' },
    { value: TaskPriority.URGENT, label: t('tasks.urgent'), color: '#8E44AD' },
    { value: TaskPriority.CRITICAL, label: t('tasks.critical'), color: '#8B0000' }
  ];

  // Находим задачу по ID из текущей доски
  useEffect(() => {
    if (taskId && currentBoard?.columns) {
      const foundTask = currentBoard.columns
        .flatMap(col => col.tasks)
        .find(task => task.id === taskId);
      
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
        setTask(null);
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
              comments: [...(task.comments || []), comment]
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
        [TaskStatus.PLANNING]: t('tasks.to_do'),
        [TaskStatus.IN_PROGRESS]: t('tasks.in_progress'),
        [TaskStatus.REVIEW]: t('tasks.review'),
        [TaskStatus.COMPLETED]: t('tasks.completed'),
        [TaskStatus.TESTING]: t('tasks.testing'),
        [TaskStatus.CANCELLED]: t('tasks.cancelled'),
        [TaskStatus.BLOCKED]: t('tasks.blocked'),
        [TaskStatus.ON_HOLD]: t('tasks.on_hold')
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
      onClose();
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
      case TaskStatus.OVERDUE: return '#DC2626';
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
          onClick={onClose}
        >
          ← {t('tasks.back_to_board')}
        </button>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? t('tasks.cancel') : t('tasks.edit')}
          </button>
          
          {isEditing && (
            <button 
              className={styles.saveButton}
              onClick={handleSaveChanges}
            >
              {t('tasks.save')}
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
                  placeholder={t('tasks.task_title')}
                />
                
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className={styles.descriptionInput}
                  placeholder={t('tasks.task_description')}
                  rows={5}
                />
                
                <div className={styles.editFields}>
                  <div className={styles.field}>
                    <label>{t('tasks.status')}:</label>
                    <CustomSelect
                      options={statusOptions}
                      value={editData.status || task.status}
                      onChange={(value) => setEditData({ ...editData, status: value as TaskStatus })}
                      placeholder={t('tasks.select_status')}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>{t('tasks.priority')}:</label>
                    <CustomSelect
                      options={priorityOptions}
                      value={editData.priority || TaskPriority.MEDIUM}
                      onChange={(value) => setEditData({ ...editData, priority: value as TaskPriority })}
                      placeholder={t('tasks.select_priority')}
                    />
                  </div>
                  
                  <div className={styles.field}>
                    <label>{t('tasks.due_date')}:</label>
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
                    <label>{t('tasks.tags')}:</label>
                    <input
                      type="text"
                      value={editData.tags?.map((tag: TaskTag) => tag.name).join(', ') || ''}
                      onChange={(e) => handleTagsChange(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                      placeholder={t('tasks.tags_comma_separated')}
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
                    <span className={styles.label}>{t('tasks.status')}:</span>
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {task.status === TaskStatus.PLANNING && t('tasks.to_do')}
                      {task.status === TaskStatus.IN_PROGRESS && t('tasks.in_progress')}
                      {task.status === TaskStatus.REVIEW && t('tasks.review')}
                      {task.status === TaskStatus.TESTING && t('tasks.testing')}
                      {task.status === TaskStatus.COMPLETED && t('tasks.completed')}
                      {task.status === TaskStatus.CANCELLED && t('tasks.cancelled')}
                      {task.status === TaskStatus.BLOCKED && t('tasks.blocked')}
                      {task.status === TaskStatus.ON_HOLD && t('tasks.on_hold')}
                      {task.status === TaskStatus.OVERDUE && 'Просрочено'}
                    </span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.label}>{t('tasks.priority')}:</span>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority === TaskPriority.CRITICAL && t('tasks.critical')}
                      {task.priority === TaskPriority.LOW && t('tasks.low')}
                      {task.priority === TaskPriority.MEDIUM && t('tasks.medium')}
                      {task.priority === TaskPriority.HIGH && t('tasks.high')}
                      {task.priority === TaskPriority.URGENT && t('tasks.urgent')}
                    </span>
                  </div>
                  
                  {task && task.dueDate && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>{t('tasks.due_date')}:</span>
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
                            title={t('tasks.cancel')}
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
                            title={t('tasks.edit_date')}
                          >
                            ✏️
                          </button>
                          <small className={styles.dateHint}>Нажмите ✏️ для быстрого изменения</small>
                        </>
                      )}
                    </div>
                  )}
                  
                  {task && task.tags && Array.isArray(task.tags) && task.tags.length > 0 && (
                    <div className={styles.metaItem}>
                      <span className={styles.label}>{t('tasks.tags')}:</span>
                      <div className={styles.tags}>
                        {task.tags.map((tag: TaskTag, index: number) => (
                          <span key={index} className={styles.tag}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Количество комментариев */}
                  <div className={styles.metaItem}>
                    <span className={styles.label}>{t('tasks.comments')}:</span>
                    <span className={styles.commentCount}>
                      {(task.comments || []).length} {(task.comments || []).length === 1 ? t('tasks.comment') : t('tasks.comments_plural')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Подзадачи */}
          {task && task.subtasks && Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
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
                        const updatedSubtasks = (task.subtasks || []).map(s =>
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
                            <h3>{t('tasks.comments')} ({(task.comments || []).length})</h3>
            
            <div className={styles.addComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('tasks.add_comment_placeholder')}
                rows={3}
              />
              <button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={styles.addCommentButton}
              >
                {t('tasks.add_comment')}
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
            <h3>{t('tasks.quick_actions')}</h3>
            
            <div className={styles.actionGroup}>
              <label>{t('tasks.change_status')}:</label>
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
                placeholder={t('tasks.select_status')}
              />
            </div>
            
            <div className={styles.actionGroup}>
              <label>{t('tasks.change_priority')}:</label>
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
                placeholder={t('tasks.select_priority')}
              />
            </div>
          </div>

          {/* Активность */}
          {task.activities && task.activities.length > 0 && (
            <div className={styles.activitySection}>
              <h3>{t('tasks.activity')}</h3>
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
