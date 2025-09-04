import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import styles from './FriendsList.module.scss';

interface FriendsListProps {
  onOpenProfile?: () => void;
}

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

const FriendsList: React.FC<FriendsListProps> = ({ onOpenProfile }) => {
  const { boards } = useSelector((state: RootState) => state.boards);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [showAllFriends, setShowAllFriends] = useState(false);

  // Получаем всех уникальных участников из всех досок
  const getAllMembers = (): Friend[] => {
    const membersMap = new Map<string, Friend>();
    
    boards.forEach(board => {
      // Добавляем владельца доски
      if (board.ownerId && board.ownerId !== currentUser?.id?.toString()) {
        if (!membersMap.has(board.ownerId)) {
          membersMap.set(board.ownerId, {
            id: board.ownerId,
            name: `Участник ${board.ownerId.slice(0, 8)}`,
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
      board.members.forEach(member => {
        if (member.id !== currentUser?.id?.toString()) {
          if (!membersMap.has(member.id)) {
            membersMap.set(member.id, {
              id: member.id,
              name: member.name || `Участник ${member.id.slice(0, 8)}`,
              email: member.email || `user${member.id.slice(0, 8)}@example.com`,
              avatar: member.avatar,
              status: member.status || 'offline',
              lastSeen: member.lastSeen,
              boardsCount: 0,
              tasksCount: 0
            });
          }
          const existingMember = membersMap.get(member.id)!;
          existingMember.boardsCount++;
        }
      });
      
      // Подсчитываем задачи для каждого участника
      board.columns.forEach(column => {
        column.tasks.forEach(task => {
          if (task.assigneeId && task.assigneeId !== currentUser?.id?.toString()) {
            const member = membersMap.get(task.assigneeId);
            if (member) {
              member.tasksCount++;
            }
          }
        });
      });
    });
    
    return Array.from(membersMap.values());
  };

  const allMembers = getAllMembers();
  const displayedMembers = showAllFriends ? allMembers : allMembers.slice(0, 6);

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
    
    if (hours < 1) return 'Только что';
    if (hours < 24) return `${hours} ч назад`;
    const days = Math.floor(hours / 24);
    return `${days} д назад`;
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
      case 'online': return 'В сети';
      case 'away': return 'Отошел';
      case 'offline': return 'Не в сети';
      default: return 'Не в сети';
    }
  };

  if (allMembers.length === 0) {
    return (
      <div className={styles.friendsList}>
        <div className={styles.header}>
          <h3 className={styles.title}>👥 Участники</h3>
          <p className={styles.subtitle}>Люди в ваших досках</p>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <span className={styles.emptyText}>Пока нет участников</span>
          <p className={styles.emptyDescription}>
            Пригласите друзей в ваши доски, чтобы работать вместе
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.friendsList}>
      <div className={styles.header}>
        <h3 className={styles.title}>👥 Участники</h3>
        <p className={styles.subtitle}>Люди в ваших досках</p>
        <span className={styles.count}>{allMembers.length} участников</span>
      </div>

      <div className={styles.membersList}>
        {membersWithRandomData.map((member) => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.memberInfo}>
              <div className={styles.avatarContainer}>
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div 
                  className={styles.statusIndicator}
                  style={{ backgroundColor: getStatusColor(member.status) }}
                />
              </div>
              
              <div className={styles.memberDetails}>
                <div className={styles.memberName}>{member.name}</div>
                <div className={styles.memberEmail}>{member.email}</div>
                <div className={styles.memberStats}>
                  <span className={styles.stat}>
                    📁 {member.boardsCount} досок
                  </span>
                  <span className={styles.stat}>
                    📋 {member.tasksCount} задач
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.memberStatus}>
              <div 
                className={styles.statusDot}
                style={{ backgroundColor: getStatusColor(member.status) }}
              />
              <span className={styles.statusText}>
                {getStatusText(member.status)}
              </span>
              <div className={styles.lastSeen}>{member.lastSeen}</div>
            </div>
          </div>
        ))}
      </div>

      {allMembers.length > 6 && (
        <button
          className={styles.showMoreBtn}
          onClick={() => setShowAllFriends(!showAllFriends)}
        >
          {showAllFriends ? 'Показать меньше' : `Показать еще ${allMembers.length - 6}`}
        </button>
      )}
    </div>
  );
};

export default FriendsList;
