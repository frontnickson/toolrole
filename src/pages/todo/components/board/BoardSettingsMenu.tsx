import React, { useRef, useEffect } from 'react';
import styles from './BoardSettingsMenu.module.scss';

interface BoardSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToFavorites: () => void;
  onAddToMyProjects: () => void;
  onDelete: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onShare: () => void;
  isFavorite: boolean;
  isInMyProjects: boolean;
  isUpdatingFavorite?: boolean;
}

const BoardSettingsMenu: React.FC<BoardSettingsMenuProps> = ({
  isOpen,
  onClose,
  onAddToFavorites,
  onAddToMyProjects,
  onDelete,
  onArchive,
  onDuplicate,
  onShare,
  isFavorite,
  isInMyProjects,
  isUpdatingFavorite = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  
  return (
    <div className={styles.menuOverlay}>
      <div ref={menuRef} className={styles.menu}>
        <div className={styles.menuHeader}>
          <h3>Настройки доски</h3>
          <button 
            onClick={onClose} 
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <div className={styles.menuItems}>
          <button
            onClick={onShare}
            className={styles.menuItem}
          >
            <span className={styles.menuIcon}>🔗</span>
            <span className={styles.menuText}>Поделиться</span>
          </button>

          <button
            onClick={onDuplicate}
            className={styles.menuItem}
          >
            <span className={styles.menuIcon}>📋</span>
            <span className={styles.menuText}>Дублировать</span>
          </button>

          <div className={styles.menuDivider} />

          <button
            onClick={onAddToFavorites}
            disabled={isUpdatingFavorite}
            className={`${styles.menuItem} ${isFavorite ? styles.active : ''} ${isUpdatingFavorite ? styles.loading : ''}`}
          >
            <span className={styles.menuIcon}>
              {isUpdatingFavorite ? '⏳' : (isFavorite ? '⭐' : '☆')}
            </span>
            <span className={styles.menuText}>
              {isUpdatingFavorite 
                ? 'Обновление...' 
                : (isFavorite ? 'Убрать из избранного' : 'Добавить в избранное')
              }
            </span>
          </button>

          <button
            onClick={onAddToMyProjects}
            className={`${styles.menuItem} ${isInMyProjects ? styles.active : ''}`}
          >
            <span className={styles.menuIcon}>
              {isInMyProjects ? '📁' : '📂'}
            </span>
            <span className={styles.menuText}>
              {isInMyProjects ? 'Убрать из моих проектов' : 'Добавить в мои проекты'}
            </span>
          </button>

          <div className={styles.menuDivider} />

          <button
            onClick={onArchive}
            className={`${styles.menuItem} ${styles.warning}`}
          >
            <span className={styles.menuIcon}>📦</span>
            <span className={styles.menuText}>Архивировать</span>
          </button>

          <button
            onClick={onDelete}
            className={`${styles.menuItem} ${styles.danger}`}
          >
            <span className={styles.menuIcon}>🗑️</span>
            <span className={styles.menuText}>Удалить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardSettingsMenu;
