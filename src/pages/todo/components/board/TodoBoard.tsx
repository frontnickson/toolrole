import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TodoCard from '../tasks/TodoCard';
import type { Task, Column } from '../../../../types';
import { TaskStatus, TaskPriority, TaskType } from '../../../../types';
import styles from './TodoBoard.module.scss';
import type { RootState } from '../../../../store';
import { addTaskToColumn, updateTask, addColumn, updateColumn, deleteColumn } from '../../../../store/slices/boardSlice';

interface TodoBoardProps {
  onTaskClick: (taskId: string) => void;
  onCreateBoard?: () => void;
}

const TodoBoard: React.FC<TodoBoardProps> = ({ onTaskClick, onCreateBoard }) => {
  const dispatch = useDispatch();
  const { currentBoard } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boards } = useSelector((state: RootState) => state.boards);

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
  const userBoards = boards.filter(board => 
    board.ownerId === currentUser?.id?.toString()
  );

  // Если у пользователя нет досок, показываем сообщение о необходимости создания
  if (userBoards.length === 0) {
    return (
      <div className={styles.noBoard}>
        <div className={styles.noBoardContent}>
          <h3>🎯 Добро пожаловать в систему управления задачами!</h3>
          <p>У вас пока нет созданных досок. Создайте свою первую доску, чтобы начать работу с задачами.</p>
          <div className={styles.noBoardActions}>
            <button 
              className={styles.createFirstBoardBtn}
              onClick={() => {
                if (onCreateBoard) {
                  onCreateBoard();
                }
              }}
            >
              🚀 Создать первую доску
            </button>
            <p className={styles.noBoardHint}>
              Доска поможет вам организовать задачи, отслеживать прогресс и работать в команде
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Если нет текущей доски, показываем сообщение
  if (!currentBoard) {
    return (
      <div className={styles.noBoard}>
        <div className={styles.noBoardContent}>
          <h3>📋 Доска не выбрана</h3>
          <p>Пожалуйста, выберите доску для работы с задачами из боковой панели</p>
          <div className={styles.noBoardActions}>
            <button 
              className={styles.selectBoardBtn}
              onClick={() => {
                // Если есть доски, выбираем первую
                if (userBoards.length > 0) {
                  // Здесь можно добавить логику для автоматического выбора первой доски
                  console.log('Выбор первой доски');
                }
              }}
            >
              📁 Выбрать доску
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Получаем колонки из текущей доски
  const columns = currentBoard.columns;

  // Получаем задачи для конкретной колонки
  const getTasksByColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    return column ? column.tasks : [];
  };

  // Обработчик добавления задачи в конкретную колонку
  const handleAddTask = (columnId: string) => {
    if (newTaskData.title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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

      dispatch(addTaskToColumn({
        boardId: currentBoard.id,
        columnId: columnId,
        task: newTask
      }));

      setNewTaskData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM
      });
      setIsAddingTask(null);
    }
  };

  // Обработчик добавления новой колонки
  const handleAddColumn = () => {
    if (newColumnData.title.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        boardId: currentBoard.id,
        title: newColumnData.title,
        description: newColumnData.description,
        icon: newColumnData.icon,
        color: newColumnData.color,
        order: columns.length,
        isLocked: false,
        isCollapsed: false,
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
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      dispatch(addColumn({
        boardId: currentBoard.id,
        column: newColumn
      }));

      setNewColumnData({
        title: '',
        description: '',
        icon: '📋',
        color: '#6B7280'
      });
      setIsAddingColumn(false);
    }
  };

  // Обработчик переименования колонки
  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    // Проверяем, является ли колонка стандартной
    if (isStandardColumn(column)) {
      alert('❌ Стандартные колонки не могут быть переименованы!\n\nКолонки по умолчанию (Планирование, В работе, На проверке, Завершено и др.) защищены от изменений.');
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
      alert('❌ Стандартные колонки не могут быть удалены!\n\nКолонки по умолчанию (Планирование, В работе, На проверке, Завершено и др.) защищены от удаления.');
      return;
    }
    
    // Проверяем, что в колонке нет задач
    const tasksInColumn = getTasksByColumn(columnId);
    if (tasksInColumn.length > 0) {
      alert('Нельзя удалить колонку с задачами. Сначала переместите или удалите все задачи.');
      return;
    }
    
    dispatch(deleteColumn({
      boardId: currentBoard.id,
      columnId: columnId
    }));
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
        {columns.map((column) => (
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
                  <h3 
                    onDoubleClick={() => {
                      // Отключаем редактирование для стандартных колонок
                      if (!isStandardColumn(column)) {
                        setEditingColumn(column.id);
                      } else {
                        // Показываем уведомление о том, что колонка защищена
                        alert('🔒 Эта колонка защищена от изменений!\n\nКолонки по умолчанию нельзя редактировать или удалять.');
                      }
                    }}
                    title={isStandardColumn(column) 
                      ? '🔒 Стандартная колонка - редактирование недоступно' 
                      : 'Двойной клик для переименования'}
                    style={{
                      cursor: isStandardColumn(column) ? 'default' : 'pointer',
                      opacity: isStandardColumn(column) ? 0.8 : 1
                    }}
                    className={isStandardColumn(column) ? styles.standardColumnTitle : ''}
                  >
                    {column.title}
                    {isStandardColumn(column) && (
                      <span className={styles.standardColumnBadge} title="Стандартная колонка">
                        🔒
                      </span>
                    )}
                  </h3>
                )}
              </div>
              
              <div className={styles.columnActions}>
                {/* Скрываем кнопку редактирования для стандартных колонок */}
                {!isStandardColumn(column) && (
                  <button
                    className={styles.columnActionBtn}
                    onClick={() => setEditingColumn(column.id)}
                    title="Переименовать колонку"
                  >
                    ✏️
                  </button>
                )}
                {/* Скрываем кнопку удаления для стандартных колонок */}
                {!isStandardColumn(column) && (
                  <button
                    className={styles.columnActionBtn}
                    onClick={() => handleDeleteColumn(column.id)}
                    title="Удалить колонку"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <div className={styles.columnContent}>
              {getTasksByColumn(column.id).map((task) => (
                <TodoCard
                  key={task.id}
                  task={task}
                  boardName={currentBoard.title}
                  columnName={column.title}
                  onUpdateTask={handleUpdateTask}
                  onTaskClick={handleTaskClick}
                />
              ))}

              {/* Форма добавления задачи */}
              {isAddingTask === column.id ? (
                <div className={styles.addTaskForm}>
                  <div className={styles.formHeader}>
                    <h4>Новая задача</h4>
                    <small>Дата выполнения автоматически установлена на завтра</small>
                  </div>
                  <input
                    type="text"
                    placeholder="Название задачи..."
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                    className={styles.taskTitleInput}
                  />
                  <textarea
                    placeholder="Описание..."
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
                      Добавить задачу
                    </button>
                    <button
                      onClick={() => setIsAddingTask(null)}
                      className={styles.cancelBtn}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.addTaskButton}
                  onClick={() => setIsAddingTask(column.id)}
                >
                  + Добавить задачу
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Кнопка добавления новой колонки */}
        {isAddingColumn ? (
          <div className={styles.addColumnForm}>
            <div className={styles.addColumnHeader}>
              <h4>Новая колонка</h4>
              <button 
                onClick={() => setIsAddingColumn(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Название колонки..."
              value={newColumnData.title}
              onChange={(e) => setNewColumnData({ ...newColumnData, title: e.target.value })}
              className={styles.columnTitleInput}
            />
            
            <textarea
              placeholder="Описание колонки..."
              value={newColumnData.description}
              onChange={(e) => setNewColumnData({ ...newColumnData, description: e.target.value })}
              className={styles.columnDescriptionInput}
              rows={2}
            />
            
            <div className={styles.columnFormActions}>
              <button
                onClick={handleAddColumn}
                className={styles.addColumnBtn}
                disabled={!newColumnData.title.trim()}
              >
                Добавить колонку
              </button>
              <button
                onClick={() => setIsAddingColumn(false)}
                className={styles.cancelBtn}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.addColumnButton}
            onClick={() => setIsAddingColumn(true)}
          >
            + Добавить колонку
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoBoard;
