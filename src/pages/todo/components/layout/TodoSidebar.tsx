import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import UserProfile from '../../../../components/ui/UserProfile';
import { useTranslation } from '../../../../utils/translations';
import { useNotifications } from '../../../../hooks/useNotifications';
import styles from './TodoSidebar.module.scss';

interface TodoSidebarProps {
  selectedProject: string;
  onProjectChange: (project: string) => void;
  onTodayClick?: () => void; // Новый пропс для обработки клика на Today
  onInboxClick?: () => void; // Новый пропс для обработки клика на Inbox
  onHomeClick?: () => void; // Новый пропс для обработки клика на Главная
  activeNavItem?: 'inbox' | 'today' | 'home' | null; // Пропс для активного элемента
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenSubscription?: () => void;
  onOpenHelp?: () => void;
  onCreateBoard?: () => void; // Новый пропс для создания доски
  onPremiumUpgrade?: () => void; // Новый пропс для перехода на премиум
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({ 
  selectedProject, 
  onProjectChange, 
  onTodayClick, 
  onInboxClick, 
  onHomeClick,
  activeNavItem: externalActiveNavItem,
  onOpenProfile,
  onOpenSettings,
  onOpenSubscription,
  onOpenHelp,
  onCreateBoard,
  onPremiumUpgrade
}) => {

  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllMyProjects, setShowAllMyProjects] = useState(false);
  const [internalActiveNavItem, setInternalActiveNavItem] = useState<'inbox' | 'today' | 'home' | null>(null);
  const { boards, error: boardsError } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const boardsArray = Array.isArray(boards) ? boards : [];
  
  // Хук для уведомлений
  const { unreadCount } = useNotifications();
  
  // Логирование для отладки
  console.log('📋 TodoSidebar: boards из Redux:', boards);
  console.log('📋 TodoSidebar: boardsArray:', boardsArray);
  console.log('📋 TodoSidebar: currentUser:', currentUser);
  console.log('📋 TodoSidebar: boardsError:', boardsError);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  // Используем внешний activeNavItem если он передан, иначе внутренний
  const activeNavItem = externalActiveNavItem !== undefined ? externalActiveNavItem : internalActiveNavItem;

  // Избранные доски - доски, которые пользователь добавил в избранное
  const favoriteBoards = boardsArray.filter(board => board.isFavorite === true);
  
  // Мои проекты - доски, где пользователь является владельцем
  const myBoards = boardsArray.filter(board => {
    const isOwner = currentUser?.id && board.ownerId === currentUser.id.toString();
    console.log('📋 TodoSidebar: Проверяем доску:', board.title, 'ownerId:', board.ownerId, 'currentUser.id:', currentUser?.id, 'isOwner:', isOwner);
    return isOwner; // Убираем проверку !board.isFavorite - показываем все доски пользователя
  });
  
  console.log('📋 TodoSidebar: favoriteBoards:', favoriteBoards);
  console.log('📋 TodoSidebar: myBoards:', myBoards);

  const displayedFavorites = showAllFavorites ? favoriteBoards : favoriteBoards.slice(0, 4);
  const displayedMyProjects = showAllMyProjects ? myBoards : myBoards.slice(0, 4);

  // Обработчик клика на Today
  const handleTodayClick = () => {
    setInternalActiveNavItem('today');
    if (onTodayClick) {
      onTodayClick();
    }
  };

  // Обработчик клика на Inbox
  const handleInboxClick = () => {
    setInternalActiveNavItem('inbox');
    if (onInboxClick) {
      onInboxClick();
    }
  };

  // Обработчик клика на Главная
  const handleHomeClick = () => {
    setInternalActiveNavItem('home');
    if (onHomeClick) {
      onHomeClick();
    }
  };

  // Обработчик выбора проекта
  const handleProjectSelect = (projectId: string) => {
    setInternalActiveNavItem(null); // Сбрасываем активный элемент навигации
    onProjectChange(projectId);
  };

  return (
    <div className={styles.sidebar}>
      {/* User Profile */}
      <UserProfile 
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
        onOpenSubscription={onOpenSubscription}
        onOpenHelp={onOpenHelp}
      />

      {/* Core Navigation */}
      <div className={styles.navigation}>
        <div 
          className={`${styles.navItem} ${activeNavItem === 'home' ? styles.active : ''}`}
          onClick={handleHomeClick}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.navIcon}>🏠</span>
          <span>{t('navigation.home')}</span>
        </div>
        <div 
          className={`${styles.navItem} ${activeNavItem === 'inbox' ? styles.active : ''}`}
          onClick={handleInboxClick}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.navIcon}>📥</span>
          <span>{t('navigation.inbox')}</span>
          {unreadCount > 0 && (
            <span className={styles.notificationBadge}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
        <div 
          className={`${styles.navItem} ${activeNavItem === 'today' ? styles.active : ''}`}
          onClick={handleTodayClick}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.navIcon}>📅</span>
          <span>{t('navigation.today')}</span>
        </div>
      </div>

      {/* Favorites */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('navigation.favorites')}</h3>
        {favoriteBoards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⭐</span>
            <span className={styles.emptyText}>{t('navigation.no_favorite_boards')}</span>
          </div>
        ) : (
          <>
            {displayedFavorites.map((board) => (
              <div
                key={board.id}
                className={`${styles.projectItem} ${selectedProject === board.id ? styles.active : ''}`}
                onClick={() => handleProjectSelect(board.id)}
              >
                <span className={styles.projectIcon}>📁</span>
                <span className={styles.projectName}>{board.title}</span>
              </div>
            ))}

            {favoriteBoards.length > 4 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setShowAllFavorites(!showAllFavorites)}
              >
                {showAllFavorites ? t('navigation.show_less') : `${t('navigation.show_more')} ${favoriteBoards.length - 4}`}
              </button>
            )}
          </>
        )}
      </div>

      {/* My Projects */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>{t('navigation.my_boards')}</h3>
          {currentUser && onCreateBoard && (
            <button 
              className={styles.addBoardBtn}
              onClick={onCreateBoard}
              title={t('navigation.create_new_board_shortcut')}
              aria-label={t('navigation.create_new_board')}
            >
              <span className={styles.addIcon}>➕</span>
            </button>
          )}
        </div>
        
        {boardsError ? (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <span className={styles.errorText}>Ошибка загрузки досок</span>
            <small className={styles.errorDetails}>{boardsError}</small>
          </div>
        ) : myBoards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📁</span>
            <span className={styles.emptyText}>{t('navigation.no_created_boards')}</span>
          </div>
        ) : (
          <>
            {displayedMyProjects.map((board) => (
              <div
                key={board.id}
                className={`${styles.projectItem} ${selectedProject === board.id ? styles.active : ''}`}
                onClick={() => handleProjectSelect(board.id)}
              >
                <span className={styles.projectIcon}>📁</span>
                <span className={styles.projectName}>{board.title}</span>
              </div>
            ))}

            {myBoards.length > 4 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setShowAllMyProjects(!showAllMyProjects)}
              >
                {showAllMyProjects ? t('navigation.show_less') : `${t('navigation.show_more')} ${myBoards.length - 4}`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Кнопка подписки внизу */}
      <div className={styles.subscriptionSection}>
        <button 
          className={styles.subscriptionBtn}
          onClick={onPremiumUpgrade}
        >
          <span className={styles.subscriptionIcon}>🚀</span>
          <span className={styles.subscriptionText}>{t('subscription.upgrade_to_premium')}</span>
        </button>
      </div>
    </div>
  );
};

export default TodoSidebar;
