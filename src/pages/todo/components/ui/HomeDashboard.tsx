import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { useTranslation } from '../../../../utils/translations';
import styles from './HomeDashboard.module.scss';
import DetailedStatistics from './DetailedStatistics';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  boardsCount: number;
  tasksCount: number;
}

const HomeDashboard: React.FC = () => {
  const { boards } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  
  // Переводы
  const { t } = useTranslation(currentUser?.language || 'ru');

  // Получаем все задачи из всех досок
  const allTasks = boards && Array.isArray(boards) 
    ? boards.flatMap(board => {
        if (!board.columns || !Array.isArray(board.columns)) {
          return [];
        }
        return board.columns.flatMap(column => {
          if (!column.tasks || !Array.isArray(column.tasks)) {
            return [];
          }
          return column.tasks;
        });
      })
    : [];

  // Статистика по задачам
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task && task.status === 'completed').length;
  const inProgressTasks = allTasks.filter(task => task && task.status === 'in_progress').length;
  const pendingTasks = allTasks.filter(task => task && task.status === 'planning').length;
  const overdueTasks = allTasks.filter(task => {
    if (!task || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  }).length;

  // Статистика по доскам
  const totalBoards = boards && Array.isArray(boards) ? boards.length : 0;
  const activeBoards = boards && Array.isArray(boards) ? boards.filter(board => board && !board.isArchived).length : 0;
  const favoriteBoards = boards && Array.isArray(boards) ? boards.filter(board => board && board.isFavorite).length : 0;

  // Статистика по времени
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const tasksCompletedThisWeek = allTasks.filter(task =>
    task && task.status === 'completed' &&
    task.completedAt &&
    new Date(task.completedAt) >= lastWeek
  ).length;

  const tasksCompletedThisMonth = allTasks.filter(task =>
    task && task.status === 'completed' &&
    task.completedAt &&
    new Date(task.completedAt) >= lastMonth
  ).length;

  // Процент выполнения
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Получаем всех уникальных участников из всех досок
  const getAllMembers = (): Friend[] => {
    const membersMap = new Map<string, Friend>();

    if (!boards || !Array.isArray(boards)) {
      return [];
    }

    boards.forEach(board => {
      // Добавляем владельца доски
      if (board.ownerId && board.ownerId !== currentUser?.id?.toString()) {
        if (!membersMap.has(board.ownerId)) {
          membersMap.set(board.ownerId, {
            id: board.ownerId,
            name: `${t('home.participant')} ${board.ownerId.slice(0, 8)}`,
            email: `user${board.ownerId.slice(0, 8)}@example.com`,
            status: 'offline',
            boardsCount: 0,
            tasksCount: 0
          });
        }
        const member = membersMap.get(board.ownerId)!;
        member.boardsCount++;
      }

      // Добавляем участников доски
      if (board.members && Array.isArray(board.members)) {
        board.members.forEach(member => {
          if (member.id !== currentUser?.id?.toString()) {
            if (!membersMap.has(member.id)) {
              membersMap.set(member.id, {
                id: member.id,
                name: `${t('home.participant')} ${member.id.slice(0, 8)}`,
                email: `user${member.id.slice(0, 8)}@example.com`,
                avatar: undefined,
                status: 'offline',
                lastSeen: member.lastSeen ? new Date(member.lastSeen).toLocaleString() : undefined,
                boardsCount: 0,
                tasksCount: 0
              });
            }
            const existingMember = membersMap.get(member.id)!;
            existingMember.boardsCount++;
          }
        });
      }

      // Подсчитываем задачи для каждого участника
      if (board.columns && Array.isArray(board.columns)) {
        board.columns.forEach(column => {
          if (column.tasks && Array.isArray(column.tasks)) {
            column.tasks.forEach(task => {
              if (task.assigneeId && task.assigneeId !== currentUser?.id?.toString()) {
                const member = membersMap.get(task.assigneeId);
                if (member) {
                  member.tasksCount++;
                }
              }
            });
          }
        });
      }
    });

    return Array.from(membersMap.values());
  };

  const allMembers = getAllMembers();
  const displayedMembers = showAllFriends ? allMembers : allMembers.slice(0, 8);

  // Генерируем случайный статус для демонстрации
  const getRandomStatus = (): 'online' | 'offline' | 'away' => {
    const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Генерируем случайное время последней активности
  const getRandomLastSeen = (): string => {
    const now = new Date();
    const hours = Math.floor(Math.random() * 72); // 0-72 часа назад
    const lastSeen = new Date(now.getTime() - hours * 60 * 60 * 1000);

    if (hours < 1) return t('home.just_now');
    if (hours < 24) return `${hours} ${t('home.hours_ago')}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t('home.days_ago')}`;
  };

  // Применяем случайные статусы и время для демонстрации
  const membersWithRandomData = displayedMembers.map(member => ({
    ...member,
    status: getRandomStatus(),
    lastSeen: getRandomLastSeen()
  }));

  const getStatusColor = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online': return '#10B981';
      case 'away': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: 'online' | 'offline' | 'away') => {
    switch (status) {
      case 'online': return t('home.online_status');
      case 'away': return t('home.away');
      case 'offline': return t('home.offline');
      default: return t('home.offline');
    }
  };

  return (
    <div className={styles.homeDashboard}>

      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.dashboardTitle}>🏠 {t('home.main_title')}</h1>
            <p className={styles.dashboardSubtitle}>
              {t('home.overview_subtitle')}
            </p>
          </div>
          <button
            className={styles.detailedStatsBtn}
            onClick={() => setShowDetailedStats(!showDetailedStats)}
          >
            {showDetailedStats ? '📊 ' + t('home.basic_statistics') : '📈 ' + t('home.more_detailed')}
          </button>
        </div>
      </div>

            {showDetailedStats ? (
        <DetailedStatistics />
      ) : (
        <>
          {/* Приветствие и статистика */}
          <div className={styles.greetingSection}>
            <div className={styles.greetingContent}>
              <div className={styles.greetingInfo}>
                <div className={styles.dateInfo}>
                  {new Date().toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </div>
                                 <div className={styles.greetingText}>
                   {t('home.good_day')}, {currentUser?.firstName || t('home.user')}
                 </div>
              </div>
              <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{completedTasks}</span>
                  <span className={styles.statLabel}>{t('home.tasks_completed')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{allMembers.length}</span>
                  <span className={styles.statLabel}>{t('home.members')}</span>
                </div>
                <button className={styles.configureBtn}>
                  <span>⚙️</span>
                  <span>{t('home.configure')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Основной контент - две колонки */}
          <div className={styles.mainContent}>
            {/* Левая колонка */}
            <div className={styles.leftColumn}>
              {/* Мои задачи */}
              <div className={styles.tasksSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.lockIcon}>🔒</span>
                    {t('home.my_tasks')}
                  </h3>
                </div>
                
                <div className={styles.tabsContainer}>
                  <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.active}`}>{t('home.upcoming')}</button>
                    <button className={styles.tab}>
                      {t('home.overdue')} ({overdueTasks})
                    </button>
                    <button className={styles.tab}>{t('home.completed')}</button>
                  </div>
                </div>

                <div className={styles.tasksList}>
                  {allTasks.slice(0, 5).map((task, index) => (
                    <div key={index} className={styles.taskItem}>
                      <div className={styles.taskStatus}>
                        {task.status === 'completed' ? '✅' : '⏳'}
                      </div>
                      <div className={styles.taskContent}>
                        <div className={styles.taskName}>{task.title}</div>
                        <div className={styles.taskMeta}>
                          <span className={styles.taskTag}>{t('home.design')}</span>
                          <span className={styles.taskDate}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ru-RU', { 
                              day: 'numeric', 
                              month: 'short' 
                            }) : t('home.no_deadline')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {allTasks.length > 5 && (
                    <button className={styles.showMoreBtn}>
                      {t('home.show_more')}
                    </button>
                  )}
                </div>
              </div>

              {/* Проекты */}
              <div className={styles.projectsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>{t('home.projects')}</h3>
                  <div className={styles.headerControls}>
                    <select className={styles.dropdown}>
                      <option>{t('home.recent')}</option>
                    </select>
                    <a href="#" className={styles.browseLink}>
                      {t('home.browse_projects')} →
                    </a>
                  </div>
                </div>

                <button className={styles.createProjectBtn}>
                  <span className={styles.plusIcon}>+</span>
                  <span>{t('home.create_project')}</span>
                </button>

                <div className={styles.projectsGrid}>
                  {boards.slice(0, 4).map((board, index) => (
                    <div key={board.id} className={styles.projectCard}>
                      <div className={styles.projectIcon}>
                        {['🔔', '📋', '👤', '📝'][index % 4]}
                      </div>
                      <div className={styles.projectInfo}>
                        <div className={styles.projectTitle}>{board.title}</div>
                        <div className={styles.projectStatus}>
                          {board.columns.flatMap(col => col.tasks).length} {t('home.tasks_with_expiring_deadline')}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {boards.length > 4 && (
                    <button className={styles.showMoreBtn}>
                      {t('home.show_more')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Правая колонка */}
            <div className={styles.rightColumn}>
              {/* Участники */}
              <div className={styles.peopleSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>{t('home.people')}</h3>
                  <div className={styles.headerControls}>
                    <select className={styles.dropdown}>
                      <option>{t('home.frequent_participants')}</option>
                    </select>
                    <a href="#" className={styles.browseLink}>
                      {t('home.view_groups')} →
                    </a>
                  </div>
                </div>

                <button className={styles.inviteBtn}>
                  <span className={styles.plusIcon}>+</span>
                  <span>{t('home.invite')}</span>
                </button>

                <div className={styles.peopleGrid}>
                  {allMembers.slice(0, 6).map((member, index) => (
                    <div key={member.id} className={styles.personCard}>
                      <div className={styles.personAvatar}>
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          <span>{member.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className={styles.personName}>
                        {member.name}
                      </div>
                    </div>
                  ))}
                  
                  {allMembers.length > 6 && (
                    <div className={styles.scrollIndicator}>
                      <span>↓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Виджеты */}
              <div className={styles.widgetsSection}>
                <div className={styles.widgetHeader}>
                  <span>{t('home.drag_drop_widgets')}</span>
                  <button className={styles.closeBtn}>×</button>
                </div>
                <button className={styles.configureWidgetBtn}>
                  <span>⚙️</span>
                  <span>{t('home.configure')}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeDashboard;
