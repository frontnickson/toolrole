import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import styles from './DashboardStats.module.scss';

interface DashboardStatsProps {
  onOpenProfile?: () => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ onOpenProfile }) => {
  const { boards } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);

  // Получаем все задачи из всех досок
  const allTasks = boards.flatMap(board => 
    board.columns.flatMap(column => column.tasks)
  );

  // Статистика по задачам
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = allTasks.filter(task => task.status === 'in_progress').length;
  const pendingTasks = allTasks.filter(task => task.status === 'planning').length;
  const overdueTasks = allTasks.filter(task => {
          if (!task || !task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'completed';
  }).length;

  // Статистика по доскам
  const totalBoards = boards.length;
  const activeBoards = boards.filter(board => !board.isArchived).length;
  const favoriteBoards = boards.filter(board => board.isFavorite).length;

  // Статистика по времени
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const tasksCompletedThisWeek = allTasks.filter(task => 
    task.status === 'completed' && 
    task.completedAt && 
    new Date(task.completedAt) >= lastWeek
  ).length;

  const tasksCompletedThisMonth = allTasks.filter(task => 
    task.status === 'completed' && 
    task.completedAt && 
    new Date(task.completedAt) >= lastMonth
  ).length;

  // Процент выполнения
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Среднее время выполнения задачи (в днях)
  const averageCompletionTime = allTasks
    .filter(task => task.status === 'completed' && task.completedAt && task.createdAt)
    .map(task => {
      const created = new Date(task.createdAt);
      const completed = new Date(task.completedAt!);
      return Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    })
    .reduce((acc, time) => acc + time, 0);

  const avgCompletionDays = averageCompletionTime > 0 
    ? Math.round(averageCompletionTime / completedTasks) 
    : 0;

  return (
    <div className={styles.dashboardStats}>
      {/* Заголовок */}
      <div className={styles.header}>
        <h2 className={styles.title}>📊 Главная</h2>
        <p className={styles.subtitle}>Обзор вашей продуктивности</p>
      </div>

      {/* Основная статистика */}
      <div className={styles.mainStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{totalTasks}</div>
            <div className={styles.statLabel}>Всего задач</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{completedTasks}</div>
            <div className={styles.statLabel}>Завершено</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{completionRate}%</div>
            <div className={styles.statLabel}>Выполнено</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>{overdueTasks}</div>
            <div className={styles.statLabel}>Просрочено</div>
          </div>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className={styles.detailedStats}>
        <div className={styles.statSection}>
          <h3 className={styles.sectionTitle}>📅 За этот период</h3>
          <div className={styles.periodStats}>
            <div className={styles.periodStat}>
              <span className={styles.periodLabel}>За неделю:</span>
              <span className={styles.periodValue}>{tasksCompletedThisWeek} задач</span>
            </div>
            <div className={styles.periodStat}>
              <span className={styles.periodLabel}>За месяц:</span>
              <span className={styles.periodValue}>{tasksCompletedThisMonth} задач</span>
            </div>
            <div className={styles.periodStat}>
              <span className={styles.periodLabel}>Среднее время:</span>
              <span className={styles.periodValue}>{avgCompletionDays} дней</span>
            </div>
          </div>
        </div>

        <div className={styles.statSection}>
          <h3 className={styles.sectionTitle}>📁 Доски</h3>
          <div className={styles.boardStats}>
            <div className={styles.boardStat}>
              <span className={styles.boardLabel}>Всего досок:</span>
              <span className={styles.boardValue}>{totalBoards}</span>
            </div>
            <div className={styles.boardStat}>
              <span className={styles.boardLabel}>Активных:</span>
              <span className={styles.boardValue}>{activeBoards}</span>
            </div>
            <div className={styles.boardStat}>
              <span className={styles.boardLabel}>В избранном:</span>
              <span className={styles.boardValue}>{favoriteBoards}</span>
            </div>
          </div>
        </div>

        <div className={styles.statSection}>
          <h3 className={styles.sectionTitle}>📊 Текущий статус</h3>
          <div className={styles.statusStats}>
            <div className={styles.statusBar}>
              <div className={styles.statusLabel}>В работе</div>
              <div className={styles.statusBarContainer}>
                <div 
                  className={styles.statusBarFill} 
                  style={{ 
                    width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%`,
                    backgroundColor: '#3B82F6'
                  }}
                />
              </div>
              <span className={styles.statusCount}>{inProgressTasks}</span>
            </div>
            <div className={styles.statusBar}>
              <div className={styles.statusLabel}>Ожидают</div>
              <div className={styles.statusBarContainer}>
                <div 
                  className={styles.statusBarFill} 
                  style={{ 
                    width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%`,
                    backgroundColor: '#F59E0B'
                  }}
                />
              </div>
              <span className={styles.statusCount}>{pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
