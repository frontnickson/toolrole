import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../store';
import { addBoard } from '../../../../store/slices/boardSlice';
import UserProfile from '../../../../components/ui/UserProfile';
import styles from './TodoSidebar.module.scss';

interface TodoSidebarProps {
  selectedProject: string;
  onProjectChange: (project: string) => void;
}

const TodoSidebar: React.FC<TodoSidebarProps> = ({ selectedProject, onProjectChange }) => {
  
  const dispatch = useDispatch();
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllMyProjects, setShowAllMyProjects] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { boards } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const boardsArray = Array.isArray(boards) ? boards : [];
  
  // Избранные доски - доски, которые пользователь добавил в избранное
  const favoriteBoards = boardsArray.filter(board => board.isFavorite === true);
  // Мои проекты - доски, где пользователь является владельцем, НО НЕ в избранном
  const myBoards = boardsArray.filter(board => 
    currentUser?.id && 
    board.ownerId === currentUser.id.toString() && 
    !board.isFavorite // Исключаем доски, которые уже в избранном
  );
  
  const displayedFavorites = showAllFavorites ? favoriteBoards : favoriteBoards.slice(0, 4);
  const displayedMyProjects = showAllMyProjects ? myBoards : myBoards.slice(0, 4);

  const handleCreateBoard = () => {
    if (!currentUser?.id) {
      console.error('Пользователь не авторизован');
      return;
    }

    const boardId = Date.now().toString();
    
    const newBoard = {
      id: boardId,
      title: `Новая доска ${myBoards.length + 1}`,
      description: 'Описание новой доски',
      icon: '📁',
      color: '#3B82F6',
      ownerId: currentUser.id.toString(),
      teamId: undefined,
      members: [],
      columns: [
        {
          id: `${boardId}-col-1`,
          boardId: boardId,
          title: 'To Do',
          description: 'Задачи для выполнения',
          icon: '📝',
          color: '#EF4444',
          order: 0,
          isLocked: false,
          isCollapsed: false,
          taskLimit: undefined,
          wipLimit: undefined,
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
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
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
        },
        {
          id: `${boardId}-col-2`,
          boardId: boardId,
          title: 'In Progress',
          description: 'Задачи в работе',
          icon: '🔄',
          color: '#F59E0B',
          order: 1,
          isLocked: false,
          isCollapsed: false,
          taskLimit: undefined,
          wipLimit: undefined,
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
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
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
        },
        {
          id: `${boardId}-col-3`,
          boardId: boardId,
          title: 'Done',
          description: 'Завершенные задачи',
          icon: '✅',
          color: '#10B981',
          order: 2,
          isLocked: false,
          isCollapsed: false,
          taskLimit: undefined,
          wipLimit: undefined,
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
            sortBy: 'order' as const,
            sortDirection: 'asc' as const
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
        }
      ],
      settings: {
        allowMemberInvites: true,
        allowPublicView: false,
        allowComments: true,
        allowAttachments: true,
        allowTaskCreation: true,
        allowTaskEditing: true,
        defaultColumnTemplate: ['To Do', 'In Progress', 'Done'],
        allowColumnCustomization: true,
        maxColumns: 10,
        allowSubtaskCreation: true,
        allowTaskAssignment: true,
        allowDueDateSetting: true,
        allowPrioritySetting: true,
        allowTagging: true,
        autoArchiveCompleted: false,
        archiveAfterDays: 30,
        autoAssignTasks: false,
        autoNotifyAssignees: true,
        emailNotifications: true,
        pushNotifications: true,
        desktopNotifications: true,
        showTaskDetails: 'members' as const,
        showMemberActivity: true,
        showTaskHistory: true
      },
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        totalMembers: 1,
        activeMembers: 1,
        lastActivity: Date.now(),
        completionRate: 0,
        averageTaskDuration: 0,
        totalComments: 0,
        totalAttachments: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isArchived: false,
      isPublic: false,
      isTemplate: false,
      templateId: undefined,
      isFavorite: false
    };
    

    const action = addBoard(newBoard);
    
    dispatch(action);

    setTimeout(() => {
      console.log('🔍 Проверяем состояние store через 50ms:');
      console.log('🔍 Все доски в store:', boards);
      console.log('🔍 Количество досок:', boards.length);
      console.log('🔍 Мои доски:', myBoards);
      console.log('🔍 Количество моих досок:', myBoards.length);
    }, 50);
    
    setRefreshKey(prev => prev + 1);
    
    alert(`Доска "${newBoard.title}" успешно создана!`);
    
    onProjectChange(newBoard.id);
  };

  return (
    <div className={styles.sidebar} key={refreshKey}>
      {/* User Profile */}
      <UserProfile />

      {/* Core Navigation */}
      <div className={styles.navigation}>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>📥</span>
          <span>Inbox</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>📅</span>
          <span>Today</span>
        </div>
        <div className={styles.navItem}>
          <span className={styles.navIcon}>🏷️</span>
          <span>Filters & Labels</span>
        </div>
      </div>

      {/* Favorites */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Favorites</h3>
        {favoriteBoards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⭐</span>
            <span className={styles.emptyText}>Нет избранных досок</span>
          </div>
        ) : (
          <>
            {displayedFavorites.map((board) => (
              <div 
                key={board.id}
                className={`${styles.projectItem} ${selectedProject === board.id ? styles.active : ''}`}
                onClick={() => onProjectChange(board.id)}
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
                {showAllFavorites ? 'Показать меньше' : `Показать еще ${favoriteBoards.length - 4}`}
              </button>
            )}
          </>
        )}
      </div>

      {/* My Projects */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>My Projects</h3>
          <div className={styles.sectionActions}>
            <button 
              className={styles.addProjectBtn}
              onClick={handleCreateBoard}
            >
              +
            </button>
            <button 
              className={styles.refreshBtn}
              onClick={() => {
                console.log('🔄 Принудительное обновление TodoSidebar');
                console.log('📊 Текущие доски:', boards);
                console.log('👤 Текущий пользователь:', currentUser);
                setRefreshKey(prev => prev + 1);
              }}
              title="Обновить состояние"
            >
              🔄
            </button>
          </div>
        </div>
        {myBoards.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📁</span>
            <span className={styles.emptyText}>Нет созданных досок</span>
          </div>
        ) : (
          <>
            {displayedMyProjects.map((board) => (
              <div 
                key={board.id} 
                className={`${styles.projectItem} ${selectedProject === board.id ? styles.active : ''}`}
                onClick={() => onProjectChange(board.id)}
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
                {showAllMyProjects ? 'Показать меньше' : `Показать еще ${myBoards.length - 4}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TodoSidebar;
