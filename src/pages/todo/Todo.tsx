import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { toggleFavorite, setCurrentBoard, deleteBoard } from '../../store/slices/boardSlice';
import TodoSidebar from './components/layout/TodoSidebar';
import TodoBoard from './components/board/TodoBoard';
import TodoList from './components/tasks/TodoList';
import TodoCalendar from './components/ui/TodoCalendar';
import NewBoardModal from './components/modals/NewBoardModal';  
import BoardSettingsMenu from './components/board/BoardSettingsMenu';
import TodoSearch from './components/ui/TodoSearch';     
import type { Task } from '../../types';
import { TaskStatus } from '../../types';
import styles from './Todo.module.scss';
import type { Board } from '../../types';
import { store } from '../../store';

interface TodoProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Todo: React.FC<TodoProps> = ({ tasks, setTasks }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentBoard } = useSelector((state: RootState) => state.boards);
  const { boards } = useSelector((state: RootState) => state.boards);
  const [selectedProject, setSelectedProject] = useState('Student Project');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('board');
  
  // Состояние для модальных окон
  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  // Функция для установки текущей доски при выборе проекта
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId);
    
    // Находим доску по ID и устанавливаем её как текущую
    const selectedBoard = boards.find(board => board.id === projectId);
    if (selectedBoard) {
      dispatch(setCurrentBoard(selectedBoard));
    }
  };

  // Горячие клавиши для поиска
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K или Cmd+K для открытия поиска
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Проверяем аутентификацию пользователя
  React.useEffect(() => {
    if (!currentUser) {
      // Если пользователь не аутентифицирован, перенаправляем на страницу входа
      navigate('/auth');
      return;
    }
    
    if (tasks.length === 0) {
      setTasks([]);
    }
  }, [currentUser, tasks.length, setTasks, navigate]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === TaskStatus.COMPLETED 
          ? TaskStatus.PLANNING 
          : TaskStatus.COMPLETED;
        return { ...task, status: newStatus, updatedAt: new Date() };
      }
      return task;
    }));
  };

  // Функция для перехода на страницу задачи
  const handleTaskClick = (taskId: string) => {
    try {
      navigate(`/todo/task/${taskId}`);
    } catch (error) {
      // Ошибка навигации, можно обработать по-другому при необходимости
    }
  };

  // Обработчики для модального окна создания доски
  const handleCreateBoard = (board: Board) => {
    // Доска уже создана и добавлена в Redux store через NewBoardModal
    // Здесь можно добавить дополнительную логику, например:
    // - Переключение на созданную доску
    // - Показ уведомления
    // - Обновление UI
    
    // Можно также закрыть модальное окно, если нужно
    // setIsNewBoardModalOpen(false);
  };

  // Обработчики для меню настроек
  const handleAddToFavorites = async () => {
    if (currentBoard && !isUpdatingFavorite) {
      setIsUpdatingFavorite(true);
      
      try {
        dispatch(toggleFavorite(currentBoard.id));
        
        // Небольшая задержка для обновления Redux store
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Принудительно закрываем и открываем меню для обновления UI
        setIsSettingsMenuOpen(false);
        setTimeout(() => setIsSettingsMenuOpen(true), 10);
      } finally {
        setIsUpdatingFavorite(false);
      }
    }
  };

  const handleAddToMyProjects = () => {
    // Здесь будет логика для добавления доски в "Мои проекты"
    // Например, если у пользователя есть список "Мои проекты", добавить туда текущую
    // Или просто показать уведомление о том, что эта функция еще не реализована
    setIsSettingsMenuOpen(false);
  };

  const handleDelete = () => {
    if (currentBoard) {
      // Подсчитываем общее количество задач во всех колонках
      const totalTasks = currentBoard.columns.reduce((total, column) => total + column.tasks.length, 0);
      
      // Проверяем, сколько досок у пользователя
      const userBoards = boards.filter(board => 
        board.ownerId === currentUser?.id?.toString()
      );
      
      let confirmMessage = `🗑️  УДАЛЕНИЕ ДОСКИ\n\n` +
        `Название: "${currentBoard.title}"\n`;
      
      if (totalTasks > 0) {
        confirmMessage += `📋 Задач в доске: ${totalTasks}\n`;
      }
      
      if (userBoards.length === 1) {
        confirmMessage += `🚨  КРИТИЧЕСКОЕ ПРЕДУПРЕЖДЕНИЕ: Это ваша единственная доска!\n` +
          `После удаления у вас не останется ни одной доски.\n\n`;
      }
      
      confirmMessage += `⚠️  ПОСЛЕДСТВИЯ УДАЛЕНИЯ:\n` +
        `• Все задачи и данные будут безвозвратно удалены\n` +
        `• Это действие нельзя отменить\n` +
        `• Доска исчезнет из всех списков\n\n` +
        `Для подтверждения введите название доски: "${currentBoard.title}"\n\n` +
        `Для отмены нажмите "Отмена"`;
      
      const userInput = prompt(confirmMessage);
      
      if (userInput === currentBoard.title) {
        // Финальное подтверждение для критических случаев
        if (userBoards.length === 1) {
          const finalConfirm = confirm(
            `🚨  ФИНАЛЬНОЕ ПОДТВЕРЖДЕНИЕ!\n\n` +
            `Вы действительно хотите удалить свою единственную доску "${currentBoard.title}"?\n\n` +
            `После этого у вас не останется ни одной доски, и вам придется создавать новую с нуля.`
          );
          
          if (!finalConfirm) {
            alert('Удаление отменено. Доска сохранена.');
            return;
          }
        }
        
        // Удаляем доску из Redux store
        dispatch(deleteBoard(currentBoard.id));
        
        // Закрываем меню настроек
        setIsSettingsMenuOpen(false);
        
        // Если удаляемая доска была выбранной, сбрасываем выбор
        if (selectedProject === currentBoard.id) {
          setSelectedProject('Student Project');
        }
        
        // Показываем уведомление об успешном удалении
        if (totalTasks > 0) {
          alert(`✅ Доска "${currentBoard.title}" и ${totalTasks} задач успешно удалены!`);
        } else {
          alert(`✅ Доска "${currentBoard.title}" успешно удалена!`);
        }
      } else if (userInput !== null) {
        // Пользователь ввел неправильное название
        alert('❌ Название доски введено неверно. Удаление отменено.');
      }
      // Если userInput === null, пользователь отменил операцию
    }
  };

  const handleArchive = () => {
    if (confirm('Архивировать доску?')) {
      setIsSettingsMenuOpen(false);
    }
  };

  const handleDuplicate = () => {
    setIsSettingsMenuOpen(false);
  };

  const handleShare = () => {
    setIsSettingsMenuOpen(false);
  };

  // Получаем задачи для текущего проекта
  const getProjectTasks = () => {
    // В реальном приложении здесь была бы фильтрация по проекту
    // Сейчас возвращаем все задачи для демонстрации
    return tasks;
  };

  const renderContentView = () => {
    const projectTasks = getProjectTasks();
    
    switch (viewMode) {
      case 'list':
        return (
          <TodoList
            tasks={projectTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleStatus={toggleTaskStatus}
            onTaskClick={handleTaskClick}
          />
        );
      case 'board':
        return (
          <TodoBoard
            tasks={projectTasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleStatus={toggleTaskStatus}
            onTaskClick={handleTaskClick}
          />
        );
      case 'calendar':
        return (
          <TodoCalendar
            tasks={projectTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleStatus={toggleTaskStatus}
            onTaskClick={handleTaskClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.todoPage}>
      <TodoSidebar 
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.projectInfo}>
            <div className={styles.breadcrumbs}>
              <span>Project Management</span>
              <span>/</span>
                          <span className={styles.currentProject}>
              {selectedProject}
            </span>
            </div>
            <p className={styles.description}>
              Система управления задачами для эффективного планирования и выполнения проектов
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.viewToggles}>
              <button 
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
              <button 
                className={`${styles.viewBtn} ${viewMode === 'board' ? styles.active : ''}`}
                onClick={() => setViewMode('board')}
              >
                Board
              </button>
              <button 
                className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
            </div>
            
            <div className={styles.globalActions}>
              <button 
                className={styles.searchBtn}
                onClick={() => setIsSearchOpen(true)}
                title="Поиск задач (Ctrl+K)"
              >
                🔍 Поиск
                <span className={styles.shortcut}>⌘K</span>
              </button>
              <button 
                className={styles.newBoardBtn}
                onClick={() => setIsNewBoardModalOpen(true)}
              >
                + Новая доска
              </button>
              <button className={styles.actionBtn}>👤</button>
              <button className={styles.actionBtn}>💬</button>
              <div className={styles.settingsContainer}>
                <button 
                  className={`${styles.actionBtn} ${isSettingsMenuOpen ? styles.active : ''}`}
                  onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                  title="Настройки доски"
                >
                  ⋯
                </button>
                
                {/* Меню настроек доски */}
                {isSettingsMenuOpen && (
                  <BoardSettingsMenu
                    key={`${currentBoard?.id}-${currentBoard?.isFavorite}`}
                    isOpen={isSettingsMenuOpen}
                    onClose={() => setIsSettingsMenuOpen(false)}
                    onAddToFavorites={handleAddToFavorites}
                    onAddToMyProjects={handleAddToMyProjects}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onDuplicate={handleDuplicate}
                    onShare={handleShare}
                    isFavorite={currentBoard?.isFavorite || false}
                    isInMyProjects={currentBoard?.ownerId === currentUser?.id?.toString()}
                    isUpdatingFavorite={isUpdatingFavorite}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {renderContentView()}
        </div>
      </div>

      {/* Модальное окно создания новой доски */}
      <NewBoardModal
        isOpen={isNewBoardModalOpen}
        onClose={() => setIsNewBoardModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />

      {/* Поиск задач */}
      <TodoSearch
        tasks={tasks}
        onTaskClick={handleTaskClick}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Todo;
