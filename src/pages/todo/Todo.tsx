import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { toggleFavorite, setCurrentBoard, deleteBoard } from '../../store/slices/boardSlice';
import { useBoardTasks } from '../../hooks/useBoardTasks';
import { useTodoRouting } from '../../hooks/useTodoRouting';
import { useTranslation } from '../../utils/translations';
import TodoSidebar from './components/layout/TodoSidebar';
import TodoBoard from './components/board/TodoBoard';
import TodoList from './components/tasks/TodoList';
import TodoCalendar from './components/ui/TodoCalendar';
import Inbox from './components/ui/Inbox';
import HomeDashboard from './components/ui/HomeDashboard';
import NewBoardModal from './components/modals/NewBoardModal';
import BoardSettingsMenu from './components/board/BoardSettingsMenu';
import TodoSearch from './components/ui/TodoSearch';
import { ProfilePanel, SettingsPanel, SubscriptionPanel, HelpPanel } from './components/profile';
import TaskPage from './components/tasks/TaskPage';

import styles from './Todo.module.scss';

/**
 * Основной компонент для управления задачами (Todo)
 * Предоставляет интерфейс для работы с досками и переключения между различными представлениями
 */
const Todo: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentBoard, boards, isLoading: boardsLoading } = useSelector((state: RootState) => state.boards);

  // Используем интегрированный хук для работы с досками и задачами
  const { 
    loadUserBoards, 
    deleteBoard: removeBoard, 
    loadBoardTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  } = useBoardTasks();
  
  // Используем хук для маршрутизации
  const { parseCurrentRoute, updateUrl } = useTodoRouting();
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  // Инициализируем состояние из URL
  useEffect(() => {
    const routeParams = parseCurrentRoute();
    
    // Устанавливаем режим просмотра из URL
    if (routeParams.mode) {
      setViewMode(routeParams.mode);
      localStorage.setItem('viewMode', routeParams.mode);
    }
    
    // Устанавливаем активный раздел из URL
    if (routeParams.section) {
      setActiveNavItem(routeParams.section);
      localStorage.setItem('activeNavItem', routeParams.section);
    }
    
    // Устанавливаем выбранную доску из URL
    if (routeParams.boardId) {
      setSelectedProject(routeParams.boardId);
      localStorage.setItem('selectedBoardId', routeParams.boardId);
      
      const board = boards.find(b => b.id === routeParams.boardId);
      if (board) {
        dispatch(setCurrentBoard(board));
      }
    }
    
    // Устанавливаем выбранную задачу из URL
    if (routeParams.taskId) {
      setSelectedTaskId(routeParams.taskId);
    } else {
      setSelectedTaskId(null);
    }
  }, [location.pathname, boards, dispatch, parseCurrentRoute]);

  const [selectedProject, setSelectedProject] = useState<string>(() => {
    return localStorage.getItem('selectedBoardId') || '';
  });

  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>(() => {
    // Восстанавливаем режим просмотра из localStorage
    return (localStorage.getItem('viewMode') as 'list' | 'board' | 'calendar') || 'board';
  });

  const [activeNavItem, setActiveNavItem] = useState<'inbox' | 'today' | 'home' | null>(() => {
    // Восстанавливаем активный элемент навигации из localStorage
    const saved = localStorage.getItem('activeNavItem');
    return saved === 'inbox' || saved === 'today' || saved === 'home' ? saved : null;
  });

  // Отладочная информация
  // console.log('🔍 Todo component - boards state:', {
  //   boards,
  //   boardsLength: boards.length,
  //   boardsLoading,
  //   currentBoard: currentBoard?.id,
  //   selectedProject,
  //   viewMode,
  //   activeNavItem
  // });

  const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<'profile' | 'settings' | 'subscription' | 'help' | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const userBoards = boards.filter(board => {
    const isOwner = currentUser?.id && board.ownerId === currentUser.id.toString();
    return isOwner;
  });

  /**
   * @param projectId - ID выбранного проекта/доски
   */
  const handleProjectChange = async (projectId: string) => {
    setSelectedProject(projectId);
    setViewMode('board'); // Сбрасываем режим просмотра на board при выборе проекта
    setActiveNavItem(null); // Сбрасываем активный элемент навигации
    setSelectedTaskId(null); // Закрываем задачу при смене проекта
    setRightPanelContent(null); // Закрываем правую панель профиля

    const selectedBoard = boards.find(board => board.id === projectId);
    
    if (selectedBoard) {
      // Сначала устанавливаем доску как текущую
      dispatch(setCurrentBoard(selectedBoard));
      localStorage.setItem('selectedBoardId', projectId);
      localStorage.setItem('viewMode', 'board');
      localStorage.setItem('activeNavItem', '');
      
      // Обновляем URL
      updateUrl({ mode: 'board', boardId: projectId, section: undefined, taskId: undefined });
      
      // Загружаем задачи для выбранной доски
      console.log('📋 Todo: Загружаем задачи для доски:', projectId);
      try {
        const result = await loadBoardTasks(projectId);
        if (result.success) {
          console.log('📋 Todo: Задачи успешно загружены для доски:', projectId);
        } else {
          console.error('📋 Todo: Ошибка загрузки задач:', result.error);
        }
      } catch (error) {
        console.error('📋 Todo: Исключение при загрузке задач:', error);
      }
    }
  };
  /**
   * Обработчик клика на Today в сайдбаре
   * Переключает на календарь и показывает задачи на сегодняшний день
   */
  const handleTodayClick = () => {
    setViewMode('calendar');
    setActiveNavItem('today');
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent(null); // Закрываем правую панель профиля
    // Сбрасываем выбранный проект, чтобы показать все задачи
    setSelectedProject('');
    dispatch(setCurrentBoard(null));
    localStorage.removeItem('selectedBoardId');
    localStorage.setItem('viewMode', 'calendar');
    localStorage.setItem('activeNavItem', 'today');
    
    // Обновляем URL
    updateUrl({ section: 'today', mode: undefined, boardId: undefined, taskId: undefined });
  };

  /**
   * Обработчик клика на Inbox в сайдбаре
   * Показывает входящие сообщения
   */
  const handleInboxClick = () => {
    setActiveNavItem('inbox');
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent(null); // Закрываем правую панель профиля
    setSelectedProject('');
    dispatch(setCurrentBoard(null));
    localStorage.removeItem('selectedBoardId');
    localStorage.setItem('activeNavItem', 'inbox');
    
    // Обновляем URL
    updateUrl({ section: 'inbox', mode: undefined, boardId: undefined, taskId: undefined });
  };

  /**
   * Обработчик клика на Главная в сайдбаре
   * Показывает дашборд с общей статистикой
   */
  const handleHomeClick = () => {
    setActiveNavItem('home');
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent(null); // Закрываем правую панель профиля
    
    // Обновляем URL
    updateUrl({ section: 'home', mode: undefined, boardId: undefined, taskId: undefined });
    setSelectedProject('');
    dispatch(setCurrentBoard(null));
    localStorage.removeItem('selectedBoardId');
    localStorage.setItem('activeNavItem', 'home');
  };

  /**
   * Функции для открытия правой панели
   */
  const openProfile = () => {
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent('profile'); // Открываем профиль (автоматически закроет предыдущую панель)
  };
  const openSettings = () => {
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent('settings'); // Открываем настройки (автоматически закроет предыдущую панель)
  };
  const openSubscription = () => {
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent('subscription'); // Открываем подписку (автоматически закроет предыдущую панель)
  };

  const openPremiumUpgrade = () => {
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent('subscription'); // Открываем подписку (автоматически закроет предыдущую панель)
  };
  const openHelp = () => {
    setSelectedTaskId(null); // Закрываем задачу
    setRightPanelContent('help'); // Открываем помощь (автоматически закроет предыдущую панель)
  };
  const closeRightPanel = () => {
    setRightPanelContent(null);
    setSelectedTaskId(null); // Закрываем задачу при закрытии панели
  };

  /**
   */
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      // Горячая клавиша для создания новой доски
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        if (currentUser) {
          setIsNewBoardModalOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentUser]);

  // Доски теперь загружаются автоматически в useAuth при аутентификации
  // useEffect(() => {
  //   if (currentUser) {
  //     loadUserBoards();
  //   }
  // }, [currentUser, loadUserBoards]);

  // Загружаем задачи для выбранной доски при инициализации
  useEffect(() => {
    if (selectedProject && boards.length > 0 && currentBoard && currentBoard.id === selectedProject) {
      // Проверяем, есть ли уже задачи в колонках
      const hasTasks = currentBoard.columns.some(column => column.tasks && column.tasks.length > 0);
      
      if (!hasTasks) {
        console.log('📋 Todo: Загружаем задачи для выбранной доски при инициализации:', selectedProject);
        loadBoardTasks(selectedProject);
      }
    }
  }, [selectedProject, boards, currentBoard, loadBoardTasks]);

  // Восстанавливаем состояние из localStorage при загрузке
  useEffect(() => {
    if (boards.length > 0 && !selectedProject) {
      setSelectedProject(boards[0].id);
    }
  }, [boards, selectedProject]);

  // Восстанавливаем viewMode и activeNavItem из localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('todoViewMode');
    const savedActiveNavItem = localStorage.getItem('todoActiveNavItem');

    if (savedViewMode) {
      setViewMode(savedViewMode as 'board' | 'list' | 'calendar');
    }

    if (savedActiveNavItem) {
      setActiveNavItem(savedActiveNavItem as 'inbox' | 'today' | 'home' | null);
    }
  }, []);

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    // Если доски загрузились, восстанавливаем состояние из localStorage
    if (boards.length > 0) {
      // Восстанавливаем выбранную доску, если она есть в localStorage
      const savedBoardId = localStorage.getItem('selectedBoardId');
      if (savedBoardId && boards.find(board => board.id === savedBoardId)) {
        const savedBoard = boards.find(board => board.id === savedBoardId);
        if (savedBoard) {
          dispatch(setCurrentBoard(savedBoard));
        }
      }
    }
  }, [currentUser, boards, dispatch, navigate, selectedProject, viewMode, activeNavItem]);


  /**
   * @param taskId - ID задачи для перехода
   */

  const handleTaskClick = (taskId: string) => {
    try {
      setRightPanelContent(null); // Закрываем правую панель профиля
      setSelectedTaskId(taskId);
      
      // Обновляем URL с учетом текущего контекста
      const currentParams = parseCurrentRoute();
      updateUrl({ 
        taskId, 
        mode: currentParams.mode || (selectedProject ? 'board' : undefined),
        boardId: currentParams.boardId || selectedProject,
        section: currentParams.section
      });
    } catch {
      // Ошибка навигации, можно обработать по-другому при необходимости
    }
  };

  const handleCreateBoard = (newBoardId?: string) => {
    if (newBoardId) {
      const newBoard = boards.find(board => board.id === newBoardId);
      if (newBoard) {
        setSelectedProject(newBoardId);
        dispatch(setCurrentBoard(newBoard));
        localStorage.setItem('selectedBoardId', newBoardId);
      }
    }

    setIsNewBoardModalOpen(false);
    setRightPanelContent(null); // Закрываем правую панель профиля
  };

  const handleAddToFavorites = async () => {
    if (currentBoard && !isUpdatingFavorite) {
      setIsUpdatingFavorite(true);

      try {
        dispatch(toggleFavorite(currentBoard.id));

        await new Promise(resolve => setTimeout(resolve, 50));

        setIsSettingsMenuOpen(false);
        setRightPanelContent(null); // Закрываем правую панель профиля
        setTimeout(() => setIsSettingsMenuOpen(true), 10);
      } finally {
        setIsUpdatingFavorite(false);
      }
    }
  };

  const handleDelete = async () => {
    if (currentBoard) {
      const totalTasks = currentBoard.columns.reduce((total, column) => total + column.tasks.length, 0);

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

        // Удаляем доску через API
        console.log('🗑️ Todo: Удаляем доску:', currentBoard.title, 'ID:', currentBoard.id);
        const result = await removeBoard(currentBoard.id);
        
        if (result.success) {
          setIsSettingsMenuOpen(false);
          setRightPanelContent(null); // Закрываем правую панель профиля

          if (selectedProject === currentBoard.id) {
            setSelectedProject('');
            localStorage.removeItem('selectedBoardId');
          }
          
          alert('✅ Доска успешно удалена!');
        } else {
          alert(`❌ Ошибка при удалении доски: ${result.error || 'Неизвестная ошибка'}`);
        }


      } else if (userInput !== null) {
        alert('❌ Название доски введено неверно. Удаление отменено.');
      }
    }
  };

  const handleArchive = () => {
    if (confirm('Архивировать доску?')) {
      setIsSettingsMenuOpen(false);
      setRightPanelContent(null); // Закрываем правую панель профиля
    }
  };

  const handleDuplicate = () => {
    setIsSettingsMenuOpen(false);
    setRightPanelContent(null); // Закрываем правую панель профиля
  };

  const handleShare = () => {
    setIsSettingsMenuOpen(false);
    setRightPanelContent(null); // Закрываем правую панель профиля
  };

  const getProjectTasks = () => {
    // console.log('🔍 getProjectTasks called with currentBoard:', currentBoard);

    if (!currentBoard || !currentBoard.columns) {
      // console.log('🔍 No currentBoard or columns, returning empty array');
      return [];
    }

    const filteredColumns = currentBoard.columns.filter(column => column && column.tasks);
    // console.log('🔍 Filtered columns:', filteredColumns);

    const projectTasks = filteredColumns
      .flatMap(column =>
        column.tasks.filter(task => task && typeof task === 'object')
      );

    // console.log('🔍 getProjectTasks result:', projectTasks);
    return projectTasks;
  };

  const getAllTasks = () => {
    // console.log('🔍 getAllTasks called with boards:', boards);

    const filteredBoards = boards.filter(board => board && board.columns);
    // console.log('🔍 Filtered boards:', filteredBoards);

    const allTasks = filteredBoards
      .flatMap(board =>
        board.columns
          .filter(column => column && column.tasks)
          .flatMap(column =>
            column.tasks.filter(task => task && typeof task === 'object')
          )
      );

    // console.log('🔍 getAllTasks result:', allTasks);
    return allTasks;
  };

  const renderContentView = () => {
    const projectTasks = getProjectTasks();
    const allTasks = getAllTasks();

    switch (viewMode) {
      case 'list':
        return (
          <TodoList
            tasks={projectTasks}
            onUpdateTask={() => { }}
            onDeleteTask={() => { }}
            onToggleStatus={() => { }}
            onTaskClick={handleTaskClick}
          />
        );
      case 'board':
        return (
          <TodoBoard
            onTaskClick={handleTaskClick}
            onCreateBoard={() => setIsNewBoardModalOpen(true)}
          />
        );
      case 'calendar':
        return boardsLoading ? (
          <div className={styles.loading}>
            <p>Загрузка календаря...</p>
          </div>
        ) : (
          <TodoCalendar
            tasks={selectedProject ? projectTasks : allTasks}
            onTaskClick={handleTaskClick}
            showAllTasks={!selectedProject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.todoPage}>
      {/* Боковая панель с проектами/досками */}
      <TodoSidebar
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        onTodayClick={handleTodayClick}
        onInboxClick={handleInboxClick}
        onHomeClick={handleHomeClick}
        activeNavItem={activeNavItem}
        onOpenProfile={openProfile}
        onOpenSettings={openSettings}
        onOpenSubscription={openSubscription}
        onOpenHelp={openHelp}
        onCreateBoard={() => setIsNewBoardModalOpen(true)}
        onPremiumUpgrade={openPremiumUpgrade}
      />

      {/* Основной контент страницы */}
      <div className={styles.mainContent}>
        {/* Заголовок с информацией о проекте и действиями */}
        {!rightPanelContent && !selectedTaskId && (userBoards.length > 0 || !selectedProject || activeNavItem === 'inbox') && (
          <div className={styles.header}>
            {/* Информация о текущем проекте */}
            <div className={styles.projectInfo}>
              <div className={styles.breadcrumbs}>
                <span>{t('navigation.project_management')}</span>
                <span>/</span>
                <span className={styles.currentProject}>
                  {rightPanelContent === 'profile' ? t('navigation.profile') :
                    rightPanelContent === 'settings' ? t('navigation.settings') :
                      rightPanelContent === 'subscription' ? t('navigation.subscription') :
                        rightPanelContent === 'help' ? t('navigation.help') :
                          activeNavItem === 'inbox' ? t('navigation.inbox') :
                            activeNavItem === 'home' ? t('navigation.home') :
                              !selectedProject ? t('navigation.today') :
                                (currentBoard?.title || t('navigation.board_not_selected'))}
                </span>
              </div>
              <p className={styles.description}>
                {rightPanelContent === 'profile'
                  ? t('navigation.manage_profile')
                  : rightPanelContent === 'settings'
                    ? t('navigation.configure_app')
                    : rightPanelContent === 'subscription'
                      ? t('navigation.choose_subscription')
                      : rightPanelContent === 'help'
                        ? t('navigation.get_help')
                        : activeNavItem === 'inbox'
                          ? t('navigation.manage_messages')
                          : activeNavItem === 'home'
                            ? t('navigation.general_statistics')
                            : !selectedProject
                              ? t('navigation.today_tasks')
                              : (currentBoard?.description || t('navigation.task_management_system'))
                }
              </p>
            </div>

            {/* Действия в заголовке */}
            <div className={styles.headerActions}>
              {/* Переключатели режимов отображения */}
              {selectedProject && !activeNavItem && (
                <div className={styles.viewToggles}>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => {
                      setViewMode('list');
                      localStorage.setItem('viewMode', 'list');
                      setActiveNavItem(null);
                      // Обновляем URL
                      updateUrl({ mode: 'list', section: undefined, taskId: undefined });
                    }}
                  >
                    {t('navigation.list')}
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'board' ? styles.active : ''}`}
                    onClick={() => {
                      setViewMode('board');
                      localStorage.setItem('viewMode', 'board');
                      setActiveNavItem(null);
                      // Обновляем URL
                      updateUrl({ mode: 'board', section: undefined, taskId: undefined });
                    }}
                  >
                    {t('navigation.board')}
                  </button>
                  <button
                    className={`${styles.viewBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
                    onClick={() => {
                      setViewMode('calendar');
                      localStorage.setItem('viewMode', 'calendar');
                      setActiveNavItem(null);
                      // Обновляем URL
                      updateUrl({ mode: 'calendar', section: undefined, taskId: undefined });
                    }}
                  >
                    {t('navigation.calendar')}
                  </button>
                </div>
              )}

              {/* Глобальные действия */}
              <div className={styles.globalActions}>
                {/* Кнопка поиска с горячей клавишей */}
                <button
                  className={styles.searchBtn}
                  onClick={() => setIsSearchOpen(true)}
                  title="Поиск задач (Ctrl+K)"
                >
                  🔍 {t('tasks.search_tasks')}
                  <span className={styles.shortcut}>⌘K</span>
                </button>
                {/* Кнопка создания новой доски */}
                <button
                  className={styles.createBoardBtn}
                  onClick={() => setIsNewBoardModalOpen(true)}
                  title={t('navigation.create_new_board_shortcut')}
                >
                  <span className={styles.createIcon}>➕</span>
                  <span>{t('navigation.create_board')}</span>
                </button>


                {/* Контейнер настроек доски */}
                {selectedProject && !activeNavItem && (
                  <div className={styles.settingsContainer}>
                    <button
                      className={`${styles.actionBtn} ${isSettingsMenuOpen ? styles.active : ''}`}
                      onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                      title={t('navigation.board_settings')}
                      disabled={!currentBoard}
                    >
                      ⋯
                    </button>

                    {/* Меню настроек доски */}
                    {isSettingsMenuOpen && currentBoard && (
                      <BoardSettingsMenu
                        key={`${currentBoard?.id}-${currentBoard?.isFavorite}`}
                        isOpen={isSettingsMenuOpen}
                        onClose={() => setIsSettingsMenuOpen(false)}
                        onAddToFavorites={handleAddToFavorites}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onDuplicate={handleDuplicate}
                        onShare={handleShare}
                        isFavorite={currentBoard?.isFavorite || false}
                        isUpdatingFavorite={isUpdatingFavorite}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Основной контент с задачами */}
        <div className={styles.content}>
          {selectedTaskId ? (
            // Показываем TaskPage вместо всего контента
            <TaskPage
              taskId={selectedTaskId}
              onClose={() => {
                setSelectedTaskId(null);
                setRightPanelContent(null); // Закрываем правую панель профиля
                navigate('/todo');
              }}
            />
          ) : rightPanelContent === 'profile' ? (
            // Показываем профиль
            <ProfilePanel onClose={closeRightPanel} />
          ) : rightPanelContent === 'settings' ? (
            // Показываем настройки
            <SettingsPanel onClose={closeRightPanel} />
          ) : rightPanelContent === 'subscription' ? (
            // Показываем подписку
            <SubscriptionPanel onClose={closeRightPanel} />
          ) : rightPanelContent === 'help' ? (
            // Показываем помощь
            <HelpPanel onClose={closeRightPanel} />
          ) : activeNavItem === 'inbox' ? (
            // Показываем Inbox
            <Inbox />
          ) : activeNavItem === 'home' ? (
            // Показываем Главная (дашборд)
            <HomeDashboard />
          ) : activeNavItem === 'today' ? (
            // Показываем Today - контент в зависимости от выбранного viewMode
            (() => {
              switch (viewMode) {
                case 'list':
                  return (
                    <TodoList
                      tasks={getAllTasks()}
                      onUpdateTask={() => { }}
                      onDeleteTask={() => { }}
                      onToggleStatus={() => { }}
                      onTaskClick={handleTaskClick}
                    />
                  );
                case 'board':
                  return (
                    <TodoBoard
                      onTaskClick={handleTaskClick}
                      onCreateBoard={() => setIsNewBoardModalOpen(true)}
                      showAllTasks={true}
                    />
                  );
                case 'calendar':
                  return boardsLoading ? (
                    <div className={styles.loading}>
                      <p>Загрузка календаря...</p>
                    </div>
                  ) : (
                    <TodoCalendar
                      tasks={getAllTasks()}
                      onTaskClick={handleTaskClick}
                      showAllTasks={true}
                    />
                  );
                default:
                  return null;
              }
            })()
          ) : !selectedProject ? (
            // В режиме Today показываем контент в зависимости от выбранного viewMode
            (() => {
              switch (viewMode) {
                case 'list':
                  return (
                    <TodoList
                      tasks={getAllTasks()}
                      onUpdateTask={() => { }}
                      onDeleteTask={() => { }}
                      onToggleStatus={() => { }}
                      onTaskClick={handleTaskClick}
                    />
                  );
                case 'board':
                  return (
                    <TodoBoard
                      onTaskClick={handleTaskClick}
                      onCreateBoard={() => setIsNewBoardModalOpen(true)}
                      showAllTasks={!selectedProject}
                    />
                  );
                case 'calendar':
                  return boardsLoading ? (
                    <div className={styles.loading}>
                      <p>Загрузка календаря...</p>
                    </div>
                  ) : (
                    <TodoCalendar
                      tasks={getAllTasks()}
                      onTaskClick={handleTaskClick}
                      showAllTasks={!selectedProject}
                    />
                  );
                default:
                  return null;
              }
            })()
          ) : (
            // Показываем обычный контент для выбранного проекта
            renderContentView()
          )}
        </div>
      </div>

      {/* Модальное окно создания новой доски */}
      <NewBoardModal
        isOpen={isNewBoardModalOpen}
        onClose={() => {
          setIsNewBoardModalOpen(false);
          setRightPanelContent(null); // Закрываем правую панель профиля
        }}
        onCreateBoard={handleCreateBoard}
      />

      {/* Компонент поиска задач */}
      <TodoSearch
        tasks={activeNavItem === 'inbox' ? [] : (selectedProject ? getProjectTasks() : getAllTasks())}
        onTaskClick={handleTaskClick}
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setRightPanelContent(null); // Закрываем правую панель профиля
        }}
      />
    </div>
  );
};

export default Todo;

