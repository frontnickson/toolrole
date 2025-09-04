import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoCard from '../tasks/TodoCard';
import type { Task, Column } from '../../../../types';
import { TaskStatus, TaskPriority, TaskType } from '../../../../types';
import styles from './TodoBoard.module.scss';
import type { RootState } from '../../../../store';
import { addTaskToColumn, updateTask, addColumn, updateColumn, deleteColumn } from '../../../../store/slices/boardSlice';
import { useTranslation } from '../../../../utils/translations';
import { useBoardTasks } from '../../../../hooks/useBoardTasks';
import { useColumns } from '../../../../hooks/useColumns';

interface TodoBoardProps {
  onTaskClick: (taskId: string) => void;
  onCreateBoard?: () => void;
  showAllTasks?: boolean; // Новый пропс для режима Today
}

const TodoBoard: React.FC<TodoBoardProps> = ({ onTaskClick, onCreateBoard, showAllTasks = false }) => {
  const dispatch = useDispatch();
  const { currentBoard } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boards } = useSelector((state: RootState) => state.boards);
  const { t } = useTranslation(currentUser?.language || 'ru');
  
  // Хуки для работы с API
  const { createTask, isLoading: isTaskLoading, error: taskError } = useBoardTasks();
  const { createColumn, isLoading: isColumnLoading, error: columnError } = useColumns();

  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM as TaskPriority
  });
  const [newColumnData, setNewColumnData] = useState({
    title: '',
    description: '',
    icon: '📋',
    color: '#6B7280'
  });

  // Получаем доски текущего пользователя
  const userBoards = boards.filter(board => {
    const isOwner = currentUser?.id && board.ownerId === currentUser.id.toString();
    return isOwner;
  });

  // Если у пользователя нет досок, показываем сообщение о необходимости создания
  if (userBoards.length === 0) {
    return (
      <div className={styles.noBoard}>
        <div className={styles.noBoardContent}>
          <h3>🎯 {t('tasks.welcome_to_task_management')}</h3>
          <p>{t('tasks.no_boards_created')}</p>
          <div className={styles.noBoardActions}>
            <button 
              className={styles.createFirstBoardBtn}
              onClick={() => {
                if (onCreateBoard) {
                  onCreateBoard();
                }
              }}
            >
              🚀 {t('tasks.create_first_board')}
            </button>
            <p className={styles.noBoardHint}>
              {t('tasks.board_helps_organize')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Если нет текущей доски и не режим Today, показываем сообщение
  if (!currentBoard && !showAllTasks) {
    return (
      <div className={styles.noBoard}>
        <div className={styles.noBoardContent}>
          <h3>📋 {t('tasks.no_board_selected')}</h3>
          <p>{t('tasks.please_select_board')}</p>
          <div className={styles.noBoardActions}>
            <button 
              className={styles.selectBoardBtn}
              onClick={() => {
                // Если есть доски, выбираем первую
                if (userBoards.length > 0) {
                  // Здесь можно добавить логику для автоматического выбора первой доски
                }
              }}
            >
              📁 {t('tasks.select_board')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // В режиме Today показываем все задачи из всех досок
  if (showAllTasks) {
    return (
      <div className={styles.todayBoard}>
        <div className={styles.todayBoardHeader}>
          <h3>📅 {t('tasks.today_tasks_from_all_projects')}</h3>
          <p>{t('tasks.all_tasks_due_today')}</p>
        </div>
        
        <div className={styles.todayBoardContent}>
          {userBoards.map(board => {
            // Проверяем, что board.columns существует и является массивом
            if (!board.columns || !Array.isArray(board.columns)) {
              return null;
            }
            
            const todayTasks = board.columns.flatMap(column => {
              // Проверяем, что column.tasks существует и является массивом
              if (!column.tasks || !Array.isArray(column.tasks)) {
                return [];
              }
              
              return column.tasks.filter(task => {
                if (!task || !task.dueDate) return false;
                const taskDate = new Date(task.dueDate);
                const today = new Date();
                return taskDate.toDateString() === today.toDateString();
              }).map(task => ({
                ...task,
                boardName: board.title,
                columnName: board.columns?.find(col => col.tasks?.some(t => t.id === task.id))?.title || 'Неизвестная колонка'
              }));
            });
            
            if (todayTasks.length === 0) return null;
            
            // Подсчитываем общее количество комментариев для доски
            const totalComments = todayTasks.reduce((total, task) => {
              return total + (task.comments?.length || 0);
            }, 0);
            
            const tasksWithComments = todayTasks.filter(task => (task.comments?.length || 0) > 0).length;
            
            return (
              <div key={board.id} className={styles.todayBoardSection}>
                <div className={styles.boardHeader}>
                  <h4 className={styles.boardTitle}>
                    <span className={styles.boardIcon}>📁</span>
                    {board.title}
                  </h4>
                  
                  {/* Статистика комментариев для доски в режиме Today */}
                  {totalComments > 0 && (
                    <div className={styles.boardCommentsStats} title={`${totalComments} ${t('tasks.comments_in_tasks')} ${tasksWithComments} задачах`}>
                      <span className={styles.commentsIcon}>💬</span>
                      <span className={styles.commentsCount}>{totalComments}</span>
                      {tasksWithComments > 1 && (
                        <span className={styles.tasksWithComments}>({tasksWithComments} задач)</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={styles.todayTasks}>
                  {todayTasks.map(task => (
                    <TodoCard
                      key={task.id}
                      task={task}
                      boardName={task.boardName}
                      columnName={task.columnName}
                      onUpdateTask={() => {}} // В режиме Today только для чтения
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Проверяем, что currentBoard существует
  if (!currentBoard) {
    return null;
  }

  // Получаем колонки из текущей доски
  const columns = currentBoard.columns || [];

  // Получаем задачи для конкретной колонки
  const getTasksByColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column || !column.tasks) return [];
    
    // Если это колонка просроченных задач, показываем все просроченные задачи из всех колонок
    if (column.title.toLowerCase().includes('просрочено') || column.title.toLowerCase().includes('overdue')) {
      const allTasks = columns.flatMap(col => col.tasks || []);
      const now = Date.now();
      return allTasks.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate < now && task.status !== 'completed';
      });
    }
    
    return column.tasks;
  };

  // Получаем статистику комментариев для колонки
  const getColumnCommentsStats = (columnId: string) => {
    const tasks = getTasksByColumn(columnId);
    const totalComments = tasks.reduce((total, task) => {
      return total + (task.comments?.length || 0);
    }, 0);
    
    const tasksWithComments = tasks.filter(task => (task.comments?.length || 0) > 0).length;
    
    return {
      totalComments,
      tasksWithComments,
      totalTasks: tasks.length
    };
  };

  // Обработчик добавления задачи в конкретную колонку
  const handleAddTask = async (columnId: string) => {
    if (newTaskData.title.trim()) {
      const taskData = {
        boardId: currentBoard.id,
        columnId: columnId,
        title: newTaskData.title,
        description: newTaskData.description,
        status: getColumnStatus(columnId),
        priority: newTaskData.priority,
        type: TaskType.TASK,
        assigneeId: undefined,
        reporterId: currentUser?.id?.toString() || 'unknown',
        watchers: [currentUser?.id?.toString() || 'unknown'],
        collaborators: [],
        dueDate: Date.now() + 24 * 60 * 60 * 1000, // Автоматически устанавливаем на завтра
        startDate: undefined,
        estimatedHours: undefined,
        actualHours: 0,
        tags: [],
        labels: [],
        attachments: [],
        subtasks: [],
        comments: [],
        isArchived: false,
        isPinned: false,
        isPrivate: false,
        allowComments: true,
        allowAttachments: true,
        parentTaskId: undefined,
        epicId: undefined,
        sprintId: undefined,
        createdBy: currentUser?.id?.toString() || 'unknown',
        updatedBy: currentUser?.id?.toString() || 'unknown',
        statistics: {
          totalComments: 0,
          totalAttachments: 0,
          totalSubtasks: 0,
          completedSubtasks: 0,
          totalLikes: 0,
          totalViews: 0,
          lastActivityAt: Date.now(),
          timeInStatus: {
            [TaskStatus.PLANNING]: 0,
            [TaskStatus.IN_PROGRESS]: 0,
            [TaskStatus.REVIEW]: 0,
            [TaskStatus.TESTING]: 0,
            [TaskStatus.COMPLETED]: 0,
            [TaskStatus.CANCELLED]: 0,
            [TaskStatus.BLOCKED]: 0,
            [TaskStatus.ON_HOLD]: 0
          }
        },
        activities: [],
        timeSpent: 0,
        order: getTasksByColumn(columnId).length,
        customFields: {}
      };

      const result = await createTask(taskData);
      
      if (result.success) {
        setNewTaskData({
          title: '',
          description: '',
          priority: TaskPriority.MEDIUM
        });
        setIsAddingTask(null);
      } else {
        console.error('Ошибка создания задачи:', result.error);
        alert(`Ошибка создания задачи: ${result.error}`);
      }
    }
  };

  // Обработчик добавления новой колонки
  const handleAddColumn = async () => {
    if (newColumnData.title.trim()) {
      const columnData = {
        title: newColumnData.title,
        description: newColumnData.description,
        icon: newColumnData.icon,
        color: newColumnData.color,
        order: columns.length,
        isLocked: false,
        isCollapsed: false,
        isStandard: false,
        tasks: [],
        settings: {
          allowTaskCreation: true,
          allowTaskEditing: true,
          allowTaskMoving: true,
          allowTaskDeletion: true,
          allowSubtaskCreation: true,
          allowCommentCreation: true,
          allowAttachmentUpload: true,
          autoSortTasks: false,
          sortBy: 'order',
          sortDirection: 'asc'
        },
        statistics: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          overdueTasks: 0,
          averageTaskDuration: 0,
          totalComments: 0,
          totalAttachments: 0,
          lastTaskUpdate: Date.now()
        }
      };

      const result = await createColumn(currentBoard.id, columnData);
      
      if (result.success) {
        setNewColumnData({
          title: '',
          description: '',
          icon: '📋',
          color: '#6B7280'
        });
        setIsAddingColumn(false);
      } else {
        console.error('Ошибка создания колонки:', result.error);
        alert(`Ошибка создания колонки: ${result.error}`);
      }
    }
  };

  // Обработчик переименования колонки
  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    // Проверяем, является ли колонка стандартной
    if (isStandardColumn(column)) {
      alert(`❌ ${t('tasks.standard_columns_cannot_rename')}\n\n${t('tasks.default_columns_protected')}`);
      setEditingColumn(null);
      return;
    }
    
    if (newTitle.trim() && newTitle.trim() !== column.title) {
      dispatch(updateColumn({
        boardId: currentBoard.id,
        columnId: columnId,
        updates: { title: newTitle.trim() }
      }));
    }
    setEditingColumn(null);
  };

  // Обработчик удаления колонки
  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    // Проверяем, является ли колонка стандартной
    if (isStandardColumn(column)) {
      alert(`❌ ${t('tasks.standard_columns_cannot_delete')}\n\n${t('tasks.default_columns_protected')}`);
      return;
    }
    
    // Проверяем, что в колонке нет задач
    const tasksInColumn = getTasksByColumn(columnId);
    if (tasksInColumn.length > 0) {
      alert(t('tasks.cannot_delete_column_with_tasks'));
      return;
    }
    
    dispatch(deleteColumn({
      boardId: currentBoard.id,
      columnId: columnId
    }));
  };

  // Получаем переведенное название колонки
  const getTranslatedColumnTitle = (column: Column): string => {
    if (!column.isStandard) {
      return column.title; // Пользовательские колонки не переводим
    }
    
    // Переводим стандартные колонки
    const columnTitle = column.title.toLowerCase();
    if (columnTitle.includes('начало') || columnTitle.includes('planning')) return t('tasks.column_planning');
    if (columnTitle.includes('работа') || columnTitle.includes('progress')) return t('tasks.column_in_progress');
    if (columnTitle.includes('проверка') || columnTitle.includes('review')) return t('tasks.column_review');
    if (columnTitle.includes('тестирование') || columnTitle.includes('testing')) return t('tasks.column_testing');
    if (columnTitle.includes('завершение') || columnTitle.includes('completed')) return t('tasks.column_completed');
    if (columnTitle.includes('просрочено') || columnTitle.includes('overdue')) return t('tasks.column_overdue');
    
    return column.title; // Fallback
  };

  // Получаем переведенное описание колонки
  const getTranslatedColumnDescription = (column: Column): string => {
    if (!column.isStandard) {
      return column.description || ''; // Пользовательские колонки не переводим
    }
    
    // Переводим стандартные колонки
    const columnTitle = column.title.toLowerCase();
    if (columnTitle.includes('начало') || columnTitle.includes('planning')) return t('tasks.column_planning_desc');
    if (columnTitle.includes('работа') || columnTitle.includes('progress')) return t('tasks.column_in_progress_desc');
    if (columnTitle.includes('проверка') || columnTitle.includes('review')) return t('tasks.column_review_desc');
    if (columnTitle.includes('тестирование') || columnTitle.includes('testing')) return t('tasks.column_testing_desc');
    if (columnTitle.includes('завершение') || columnTitle.includes('completed')) return t('tasks.column_completed_desc');
    if (columnTitle.includes('просрочено') || columnTitle.includes('overdue')) return t('tasks.column_overdue_desc');
    
    return column.description || ''; // Fallback
  };

  // Получаем статус колонки для задач
  const getColumnStatus = (columnId: string): TaskStatus => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return TaskStatus.PLANNING;
    
    // Определяем статус по названию колонки
    const columnTitle = column.title.toLowerCase();
    if (columnTitle.includes('начало') || columnTitle.includes('planning') || columnTitle.includes('to do')) return TaskStatus.PLANNING;
    if (columnTitle.includes('работа') || columnTitle.includes('progress') || columnTitle.includes('in progress')) return TaskStatus.IN_PROGRESS;
    if (columnTitle.includes('проверка') || columnTitle.includes('review')) return TaskStatus.REVIEW;
    if (columnTitle.includes('завершение') || columnTitle.includes('completed') || columnTitle.includes('done')) return TaskStatus.COMPLETED;
    if (columnTitle.includes('просрочено') || columnTitle.includes('overdue')) return TaskStatus.OVERDUE;
    
    return TaskStatus.PLANNING;
  };

  /**
   * Проверяет, является ли колонка стандартной (защищенной от изменений)
   * Стандартные колонки создаются автоматически при создании доски и не могут быть
   * переименованы или удалены пользователем
   */
  const isStandardColumn = (column: Column): boolean => {
    // Сначала проверяем флаг isStandard (новый способ)
    if (column.isStandard === true) {
      return true;
    }
    
    // Fallback: проверяем по названию для обратной совместимости
    const standardTitles = [
      'Начало работы', 'To Do', 'To-Do', 'ToDo', 'Планирование', 'Planning',
      'В работе', 'In Progress', 'In-Progress', 'InProgress', 'В процессе',
      'Проверка', 'Review', 'Testing', 'На проверке',
      'Завершение', 'Completed', 'Done', 'Finished', 'Завершено',
      'Просрочено', 'Overdue', 'Просроченные',
      'Тестирование', 'Отменено', 'Cancelled', 'Заблокировано', 'Blocked',
      'На паузе', 'On Hold', 'Paused'
    ];
    
    return standardTitles.some(title => 
      column.title.toLowerCase().includes(title.toLowerCase())
    );
  };

  // Обработчик обновления задачи
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    dispatch(updateTask({
      boardId: currentBoard.id,
      taskId: taskId,
      updates: updates
    }));
  };

  // Обработчик клика по задаче
  const handleTaskClick = (taskId: string) => {
    onTaskClick(taskId);
  };

  return (
    <div className={styles.board}>
      {/* Существующие колонки */}
      <div className={styles.boardContent}>
        {columns && Array.isArray(columns) && columns.map((column) => (
          <div key={column.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span className={styles.columnIcon}>{column.icon}</span>
                {editingColumn === column.id ? (
                  <input
                    type="text"
                    defaultValue={column.title}
                    className={styles.columnTitleInput}
                    onBlur={(e) => handleRenameColumn(column.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameColumn(column.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div className={styles.columnTitleContent}>
                    <h3 
                      onDoubleClick={() => {
                        // Отключаем редактирование для стандартных колонок
                        if (!isStandardColumn(column)) {
                          setEditingColumn(column.id);
                        } else {
                          // Показываем уведомление о том, что колонка защищена
                          alert(`🔒 ${t('tasks.column_protected_from_changes')}\n\n${t('tasks.default_columns_cannot_edit')}`);
                        }
                      }}
                      title={isStandardColumn(column) 
                        ? `🔒 ${t('tasks.standard_column_editing_unavailable')}` 
                        : 'Двойной клик для переименования'}
                      style={{
                        cursor: isStandardColumn(column) ? 'default' : 'pointer',
                        opacity: isStandardColumn(column) ? 0.8 : 1
                      }}
                      className={isStandardColumn(column) ? styles.standardColumnTitle : ''}
                    >
                      {getTranslatedColumnTitle(column)}
                      {isStandardColumn(column) && (
                        <span className={styles.standardColumnBadge} title={t('tasks.standard_column')}>
                          🔒
                        </span>
                      )}
                    </h3>
                    
                    {/* Статистика комментариев для колонки */}
                    <div className={styles.columnStats}>
                      {(() => {
                        const stats = getColumnCommentsStats(column.id);
                        if (stats.totalComments === 0) return null;
                        
                        return (
                          <div className={styles.commentsStats} title={`${stats.totalComments} ${t('tasks.comments_in_tasks')} ${stats.tasksWithComments} задачах`}>
                            <span className={styles.commentsIcon}>💬</span>
                            <span className={styles.commentsCount}>{stats.totalComments}</span>
                            {stats.tasksWithComments > 1 && (
                              <span className={styles.tasksWithComments}>({stats.tasksWithComments} задач)</span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.columnActions}>
                {/* Скрываем кнопку редактирования для стандартных колонок */}
                {!isStandardColumn(column) && (
                  <button
                    className={styles.columnActionBtn}
                    onClick={() => setEditingColumn(column.id)}
                    title={t('tasks.rename_column')}
                  >
                    ✏️
                  </button>
                )}
                {/* Скрываем кнопку удаления для стандартных колонок */}
                {!isStandardColumn(column) && (
                  <button
                    className={styles.columnActionBtn}
                    onClick={() => handleDeleteColumn(column.id)}
                    title={t('tasks.delete_column')}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <div className={styles.columnContent}>
              {getTasksByColumn(column.id) && Array.isArray(getTasksByColumn(column.id)) && getTasksByColumn(column.id).map((task) => (
                <TodoCard
                  key={task.id}
                  task={task}
                  boardName={currentBoard.title}
                  columnName={column.title}
                  onUpdateTask={handleUpdateTask}
                  onTaskClick={handleTaskClick}
                />
              ))}

              {/* Форма добавления задачи - не показываем для колонки просроченных задач */}
              {!column.title.toLowerCase().includes('просрочено') && !column.title.toLowerCase().includes('overdue') && (
                <>
                  {isAddingTask === column.id ? (
                    <div className={styles.addTaskForm}>
                      <div className={styles.formHeader}>
                        <h4>{t('tasks.new_task')}</h4>
                        <small>{t('tasks.due_date_auto_tomorrow')}</small>
                      </div>
                      <input
                        type="text"
                        placeholder={t('tasks.task_title_placeholder')}
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        className={styles.taskTitleInput}
                      />
                      <textarea
                        placeholder={t('tasks.description_placeholder')}
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                        className={styles.taskDescriptionInput}
                        rows={2}
                      />
                      <div className={styles.taskFormActions}>
                        <button
                          onClick={() => handleAddTask(column.id)}
                          className={styles.addTaskBtn}
                          disabled={!newTaskData.title.trim()}
                        >
                          {t('tasks.add_task')}
                        </button>
                        <button
                          onClick={() => setIsAddingTask(null)}
                          className={styles.cancelBtn}
                        >
                          {t('common.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className={styles.addTaskButton}
                      onClick={() => setIsAddingTask(column.id)}
                    >
                      + {t('tasks.add_task_button')}
                    </button>
                  )}
                </>
              )}
              
              {/* Информационное сообщение для колонки просроченных задач */}
              {column.title.toLowerCase().includes('просрочено') || column.title.toLowerCase().includes('overdue') ? (
                <div className={styles.overdueInfo}>
                  <p>⚠️ {t('tasks.overdue_tasks_info')}</p>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {/* Убрана возможность добавления новых колонок */}
      </div>
    </div>
  );
};

export default TodoBoard;
